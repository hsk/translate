- Abstract

	We present an approach to enriching the type system of ML with a restricted form of dependent types, where type index terms are required to be drawn from a given type index language L that is completely separate from run-time programs, leading to the DML(L) language schema.

	我々は、DML（L）言語スキーマにつながる、型インデックス項がランタイムプログラムから完全に分離され、指定された型インデックス言語Lから取り出されることが要求される依存型の制限された形で、MLの型システムの拡張のアプローチを提示する。

	This enrichment allows for specification and inference of significantly more precise type information, facilitating program error detection and compiler optimization.

	この拡張は、プログラムエラー検出およびコンパイラの最適化を容易にし、仕様および有意でより正確な型情報の推論を可能にする。

	The primary contribution of the paper lies in our language design, which can effectively support the use of dependent types in practical programming.

	本論文の主要な貢献は、効果的に実践的なプログラミングの依存型の使用をサポートすることができる、我々の言語設計にあります。

	In particular, this design makes it both natural and straightforward to accommodate dependent types in the presence of effects such as references and exceptions.

	特に、このデザインは、それが自然で簡単にこのような参照や例外などの効果の存在下での依存タイプに対応することができます。

- 1 Introduction

	In this paper, we report some research on supporting the use of dependent types in practical programming, drawing most of the results from (Xi, 1998).

	本論文では、実用的なプログラミングで依存型の使用をサポートした（Xi, 1998）からの結果を最大限に生かした上でいくつかの研究を報告している。

	We do not attempt to incorporate into this paper some recent, closely related results (e.g., guarded recursive datatypes (Xi et al., 2003), Applied Type System (Xi, 2004)), with which we only provide certain comparison.

	我々はこの論文にいくつかの最近の、密接に関連した結果(例えば、ガードされた再帰的なデータ型(Xi et al., 2003)、Applied Type System (Xi, 2004))を組み込まない。

	----

	Type systems for functional languages can be broadly classified into those for rich, realistic programming languages such as Standard ML (Milner et al., 1997), Objective Caml (INRIA, n.d.), or Haskell (Peyton Jones et al. , 1999), and those for small, pure languages such as the ones underlying Coq (Dowek et al., 1993), NuPrl (Constable et al. , 1986), or PX (Hayashi & Nakano, 1988).

	関数型言語の型システムはStandard ML（Milnerら, 1997）、Objective Caml (INRIA, n.d.)
	、またはHaskell（Peyton Jones ら、1999）などの広い意味で高級で現実的なプログラミング言語のためのものと、小さくて純粋な言語Coq（Dowekら、1993）、NuPrl（Constableら、1986）、またはPX（林·中野、1988）のようなものが根底にあるものに分類することができます。

	In practical programming, type-checking should be theoretically decidable as well as practically feasible for typical programs without requiring an overwhelmingly large number of type annotations.

	実用的なプログラミングでは、型チェックは、理論的には型注釈の大部分を必要とすることなく、典型的なプログラムのための実用的に実行可能なだけでなく、決定可能であるべきである。

	In order to achieve this, the type systems for realistic programming languages are often relatively simple, and only relatively elementary properties　of programs can be expressed and thus checked by a type-checker.

	これを達成するために、現実的なプログラミング言語の型システムは、多くの場合、型チェッカによって確認されているので比較的簡単に、プログラムだけの比較的基本の特性を発現させることができる。

	For instance, the error of taking the first element out of an empty list cannot be prevented by the type system of ML since it does not distinguish an empty list from a non-empty one.

	例えば、空のリストから最初の要素を取得するエラーは空でないリストと空のリストを区別していないので、MLの型システムによって防止することができない。

	Richer type theories such as the Calculus of Inductive Constructions (underlying Coq) or Martin-L¨of type theories (underlying NuPrl) allow full specifications to be formulated, which means that type-checking becomes undecidable or requires excessively verbose type annotations.

	（Coqの基礎をなす）帰納的構造の計算法または（NuPrlの基礎をなす）マーティン-L型理論など豊かな型理論は、完全な仕様が策定されることを可能にし、これは型チェックが決定不能になったり、過度に冗長な型注釈が必要なことを意味する。

	It also constrains the underlying functional language to remain relatively pure, so that it is possible to effectively reason about program properties within a type theory.

	また、効果的に型理論内のプログラムのプロパティについて推論することが可能となるように、基礎となる関数型言語では、比較的純粋なままに制約する。

		datatype ’a list (int) =
		    nil(0) | {n:nat} cons(n+1) of ’a * ’a list(n)

		fun(’a)
		    append (nil, ys) = ys
		  | append (cons (x, xs), ys) = cons (x, append (xs, ys))
		withtype {m:nat,n:nat} ’a list(m) * ’a list(n) -> ’a list(m+n)

		Fig. 1. An introductory example: appending lists

	----

	Some progress has been made towards bridging this gap, for example, by extracting Caml programs from Coq proofs, by synthesizing proof skeletons from Caml programs (Parent, 1995), or by embedding fragments of ML into NuPrl (Kreitz et al., 1998).

	いくつかの進展は、このギャップを埋めることに向けてなされたもので、例えば、Coqの証明からCamlのプログラムを抽出する、 Camlのプログラム（Parent、1995）から証明骨格を合成する、またはNuPrlにMLのフラグメントを埋め込む（Kreitzら、1998）ことによって行われている。

	In this paper, we address the issue by designing a type system for practical programming that supports a restricted form of dependent types, allowing more program invariants to be captured by types.

	本論文で、我々は、複数のプログラム不変条件はタイプによって捕獲されることを可能にする、依存型の制限された形式をサポートしている実用的なプログラミングのための型システムを設計することで問題に対処する。

	We conservatively extend the type system of ML by allowing some dependencies while maintaining practical and unintrusive type-checking.

	我々は、実用的である事とunintrusive型チェックを維持しながら、いくつかの依存関係を可能にすることにより、MLの型システムを保守的に拡張する。

	It will be shown that a program that is typable in the extended type system is already typable in ML.

	これは、拡張型システムで型付けされたプログラムは、MLで既に型付け可能であることが示される。

	However, the program may be assigned a more precise type in the extended type system than in ML.

	しかし、プログラムは、MLよりも拡張型システムにおいて、より正確な型を割り当てることができる。

	It is in this sense we refer to the extended type system as a conservative extension of ML.

	それは我々がMLの保守的な拡張として拡張型システムを参照するという意味である。

	----

	We now present a short example from our implementation before going into further details.

	我々は、ここでさらに詳細に入る前に、我々の実装から短い例を提示する。

	A correct implementation of the append function on lists should return a list of length m + n when given two lists of length m and n, respectively.

	リストに追加する関数の正しい実装はそれぞれ長さmとnの2つのリストを与えられた時長さm+nのリストを返す必要があります。

	This property, however, cannot be captured by the type system of ML, and the inadequacy can be remedied if we introduce a restricted form of dependent types.

	このプロパティは、MLの型システムによってキャプチャできないが、しかし、我々が依存型の制限された形を導入した場合に不備を改善することができます。

	----

	The code in Figure 1 is written in the style of ML with a type annotation.

	図1のコードは、型注釈を持つMLのスタイルで書かれている。

	The declared type constructor list takes a type τ and a type index n (of sort int) to form a type (τ )list(n) for lists of length n in which each element is of type τ .

	宣言された型コンストラクタリストは、型τと(種intの)型インデックスnを取りtype(τ)list(n)の形式で各要素が型τで長さnのリストです。

	The value constructors associated with list are then assigned certain dependent types:

	リストに関連付けられた値コンストラクタは、その後、特定の依存型が割り当てられています:

	- The syntax nil(0) states that the list constructor nil is assigned the type ∀α.(α)list(0), that is, nil is a list of length 0.
	- 構文nil(0)の状態はリストのコンストラクタはnilが型`∀α.(α)list(0)`が割り当てられていること、つまり、nilは長さ0のリストである。

	- The syntax `{n:nat} cons(n+1)` of `’a * ’a list(n)` states that the list constructor cons is assigned the following type,
	- `’a * ’a list(n)` の`{n:nat} cons(n+1)` 構文は、リストのコンストラクタconsは次のタイプが割り当てられており、

			∀α.Πn:nat. α ∗ (α)list(n) → (α)list(n + 1)

		that is, cons yields a list of length n + 1 when given a pair consisting of an element and a list of length n.

		すなわち、要素と、長さnのリストのペアが与えられたときにconsは長さn+1のリストを与える。

		We use nat for a subset sort defined as `{a : int | a ≥ 0}` and the syntax `{n:nat}` for a universal quantifier over type index variable n of the subset sort nat.

		私たちは、ソートnat部分集合のタイプインデックス変数n以上の普遍数量詞のために、ソート`{a : int | a ≥ 0}`と`{n:nat}`構文として定義された部分集合にnatを使用します。


	The withtype clause in the definition of the function append is a type annotation, which precisely states that append returns a list of length m + n when given a pair of lists of length m and n, respectively.

	関数appendの定義でwithtype句は型注釈で、正確にそのそれぞれの長さmとnのリストの対が与えられたときに長さm + nのリストを足し合わせて返す。

	The annotated type can be formally written

	注釈付きの型は、形式的に記述することができ、

		fun (’a)
		    filter p [] = []
		  | filter p (x :: xs) = if p (x) then x :: filter p xs else filter p xs
		withtype {m:nat} ’a list (m) -> [n:nat | n <= m] ’a list (n)

		Fig. 2. Another introductory example: filtering lists

	as follows:

	次のように：


		∀α.Πm:nat.Πn:nat. (α)list(m) ∗ (α)list(n) → (α)list(m + n)

	which we often call a universal dependent type.

	我々はしばしばユニバーサル依存型を呼び出します。

	In general, the programmer is responsible for assigning dependent types to value constructors associated with a declared datatype constructor;

	一般的には、プログラマが宣言したデータ型のコンストラクタに関連付けられている値のコンストラクタに依存型を割り当てる責任がある。

	he or she is also responsible for providing type annotations against which programs are automatically checked.
	
	彼または彼女はまた、プログラムが自動的にチェックされ、それに対して型注釈を提供する責任があります。

	----

	Adding dependent types to ML raises a number of theoretical and pragmatic questions.

	MLへの依存型を追加は、理論的、実践的な問題がいくつか起きる。

	In particular, the kind of pure type inference in ML, which is certainly desirable in practice, becomes untenable, and a large portion of the paper is devoted to addressing various issues involved in supporting a form of partial type inference.

	具体的には、実際には確かに望ましいMLで純粋な型推論の種類は、支持できないなり、論文の大部分は、部分的な型推論の形式をサポートしているに関与する様々な問題に対処するに専念しています。

	We briefly summarize our results and design choices as follows.
	
	次のように私たちは簡潔に我々の結果と設計上の選択をまとめる。

	----

	The first question that arises is the meaning of expressions with effects when they occur as type index terms.

	最初の問題は、彼らは型インデックス項として発生したときに、その発生したが効果を持つ式の意味である。

	In order to avoid the difficulty, we require that type index terms be pure.

	困難を回避するために、我々はその型インデックス項が純粋であることが必要です。

	In fact, our type system is parameterized over a pure type index language from which type index terms are drawn.

	実際には、我々の型システムは、型インデックス項が書かれるから純粋な型インデックス言語上でパラメータ化されている。

	We can maintain this purity and still make the connection to run-time values by using singleton types, such as int(n), which is the type for integer expressions of value equal to n.

	私たちは、この純度を維持し、まだそのnに等しい値の整数式の型であるint(n)などのシングルトン型を、使用して値を実行時の接続を行うことができます。

	This is critical for practical applications such as static elimination of array bound checks (Xi & Pfenning, 1998).

	これは、このような配列境界チェック(Xi & Pfenning, 1998)の静的除去などの実用的なアプリケーションのために重要である。

	----

	The second question is the decidability and practicality of type-checking.

	第二の問題は、決定可能性と型チェックの実用性である。

	We address this in two steps: the first step is to define an explicitly typed (and unacceptably verbose) language for which type-checking is easily reduced to constraint satisfaction in some type index language L.

	我々は2つのステップでこれに対処する：最初のステップは、型チェックが簡単にいくつかの型インデックス言語Lに満足度を制約に還元されるために明示的に入力する（受け入れ難いほど冗長な）言語を定義することです

	The second step is to define an elaboration from DML(L), a slightly extended fragment of ML, to the fully explicitly typed language which preserves the standard operational semantics.

	第二段階は、標準的な操作的意味論を維持し、完全に明示的に型付けされた言語に、DML（L）、MLをわずかに拡張した断片から推敲を定義することです。

	The correctness of elaboration and decidability of type-checking modulo constraint satisfiability constitute the main technical contribution of this paper.

	精緻化と型チェックモジュロ制約充足の決定可能性の正しさは、この論文の主な技術的貢献を構成している。

	----

	The third question is the interface between dependently annotated and other parts of a program or a library.

	第三の問題は、プログラムやライブラリの依存注釈付きの他の部分との間のインターフェースである。

	For this we use existential dependent types, although they introduce non-trivial technical complications into the elaboration procedure.

	彼らは推敲手続きに非自明な技術的な複雑化を引き起こしますが、このために我々は、existential(実存)依存型を使用します。

	Our experience clearly shows that existential dependent types, which are involved in nearly all the realistic examples in our experiments, are indispensable in practice.

	我々の経験は、明らかに、我々の実験ではほぼすべての現実的な実施例に関係しているexistential(実存)依存型は、実際には不可欠であることを示している。

		∀α.Πm:nat. (α)list(m) → Σn:{a : nat | a ≤ m}. (α)list(n)

	where {a : nat | a ≤ m} is a sort for natural numbers that are less than or equal to m.

	ここで、{a : nat | a ≤ m} はm以下の自然数のソートです。

	The type `Σn:{a : nat | a ≤ m}. (α)list(n)`, which is for lists of length less than or equal to m, is what we call an existential dependent type.

	m以下か等しい長さのリストである型`Σn:{a : nat | a ≤ m}. (α)list(n)`は、我々がexistential(実存)依存型と呼んでいるものです。

	The type assigned to filter simply means that the output list returned by filter cannot be longer than the input list taken by filter.

	単にフィルタリングするために割り当てられたタイプは、フィルタによって返された出力リストがフィルターを通した入力リストよりも長くすることはできないことを意味します。

	Without existential dependent types, in order to assign a type to filter, we may have to compute in the type system the exact length of the output list returned by filter in terms of the input list and the predicate taken by filter.

	existential(実存)依存型がなければ、フィルタに型を割り当てるために、我々は型システムに入力リストとフィルタを通した述語の面でフィルタによって返された出力リストの正確な長さを計算する必要があります。

	This would most likely make the type system too complicated for practical programming.

	これはほとんどの場合実用的なプログラミングのための型システムが複雑になるだろう。

	For instance, the function filter defined in Figure 2 is assigned the following types:

	例えば、図2で定義された関数フィルタは、次の型が割り当てられます。

	----

	We have so far finished developing a theoretical foundation for combining dependent types with all the major features in the core of ML, including datatype declarations, higher-order functions, general recursion, polymorphism, mutable references and exceptions.

	我々はこれまでに、データ型の宣言、高階関数、一般的な再帰、多相型、変更可能な参照や例外を含むMLのコア内のすべての主要な機能を持つ依存型を組み合わせるための理論的基礎の開発を完了した。

	We have also implemented our design for a fragment of ML that encompasses all these features.

	また、これらすべての機能を包含し、MLの断片のために我々のデザインを実装しました。

	In addition, we have experimented with different constraint domains and applications.

	加えて、我々は別の制約ドメインおよびアプリケーションで実験してきた。

	Many non-trivial examples can be found in (Xi, 1999).

	多くの非自明な例は(Xi、1999)に記載されています。

	At this point, we suggest that the reader first take a look at the examples in Section 7 so as to obtain a sense as to what can be effectively done in DML.

	この時点で、我々は、読者が最初にそう効果的にDMLで行うことができるものにとして意味が得られるように7章の例を見てみてください。

	----

	In our experience, DML(L) is acceptable from the pragmatic point of view: programs can often be annotated with little internal change and type annotations are usually concise and to the point.

	我々の経験では、DML（L）は、ビューの実際的な観点から許容さ：プログラムは、多くの場合、簡潔な通常少し内部変更と種類の注釈としている注釈を付け、ポイントにすることができます。

	The resulting constraint simplification problems can be solved efficiently in practice once the type index language L is properly chosen.

	型インデックス言語Lが適切に選択された後、得られた制約の簡略化の問題は、実際に効率的に解くことができる。

	Also the type annotations are mechanically verified, and therefore can be fully trusted as program documentation.

	また、型注釈は、機械的に検証されているため、完全にプログラムドキュメントとして信頼することができます。

	----

	The form of dependent types studied in this paper is substantially different from the usual form of dependent types in Martin-L¨of’s development of constructive type theory (Martin-L¨of, 1984; Martin-L¨of, 1985).

	本論文で研究した依存型の形式は、建設的な型理論のマーティン-LOFが開発した依存型の通常の形と実質的に異なる(Martin-L¨of, 1984; Martin-L¨of, 1985)。

	In some earlier research work (Xi, 1998; Xi & Pfenning, 1999) on which this paper is largely based, the dependent types studied in this paper are called a restricted form of dependent types.

	いくつかの以前の研究作業では、この論文は、主に(Xi, 1998; Xi & Pfenning, 1999)に基づいており、本論文で検討する依存型は、依存型の限定された形と呼ばれている。

	From now on, we may also use the name DML-style dependent types to refer to such a restricted form of dependent types.

	今から、我々はまた、依存型のような制限された形を参照するためにDMLスタイル依存型の名前を使用することができます。

	----

	The remainder of the paper is organized as follows.

	次のように論文の構成はされている。

	In Section 2, we present as a starting point a simply typed language λpat, which essentially extends the simply typed λ-calculus with recursion and general pattern matching.

	2章では、私たちは、単純に型付けされた言語として存在するλpatを出発点として、本質的に再帰と一般的なパターンマッチングと単純に型指定されたλ計算を拡張します。

	We then formally describe in Section 3 how type index languages can be formed.

	私たちは、その後正式に3章でタイプインデックス言語がどのように形成することができるかを説明します。

	In particular, we explain how constraint relations can be properly defined in type index languages.

	特に、我々は、制約関係が正しく型インデックス言語で定義することが可能な方法について説明します。

	The core of the paper lies in Section 4, where a language λΠ,Σ pat is introduced that extends λpat with both universal and existential dependent types.

	論文のコアは、universal(普遍的)かつexistential(実存)依存型の両方を持つλpat拡張言語λΠ,Σpatが導入された4章です。

	We also formally prove the subject reduction theorem and the progress theorem for λΠ,Σ pat , thus establishing the type soundness of λΠ,Σ pat .

	我々はまた、正式にこのようにλΠ,Σpatのタイプの健全性を確立し、対象還元定理(subect reduction定理)とλΠ,ΣpatのProgress定理を証明する。

	In Section 5, we introduce an external language DML0 designed for the programmer to construct programs that can be elaborated into λΠ,Σ pat .

	5章では、我々はλΠ,Σ pat に合成することができるプログラムを構築するために、プログラマのために設計された外部言語DML0をご紹介します。

	We present a set of elaboration rules and then justify these rules by proving that they preserve the dynamic semantics of programs.

	我々は、推敲ルールのセットを提示し、その後、彼らはプログラムの動的なセマンティクスを維持することを証明することによって、これらの規則を正当化する。

	In support of the practicality of λΠ,Σ pat , we extend λΠ,Σ pat in Section 6 with parametric polymorphism (as is supported in ML), exceptions and references.

	λΠ, Σ patの実用性のサポートでは、我々は、λΠ,Σ patを6章で（MLでサポートされていたように）パラメトリック多相型、例外と参照で拡張します。

	Also, we present some interesting examples in Section 7 to give the reader a feel as to how dependent types can be used in practice to capture program invariants.

	また、我々は、プログラムの不変条件を捕捉するために、実際にどのように依存型を使用できるかの感じを読者に与えるために7章でいくつかの興味深い例を提示する。

	We mention some closely related work in Section 8 and then conclude.

	我々は、8章でいくつかの関連研究に言及し結論を述べる。

- 2 λpat: A starting point

	We introduce a simply typed programming language λpat, which essentially extends the simply typed λ-calculus with pattern matching.

	我々は基本的にパターンマッチングと単純に型付けされたλ計算を拡張し、単純に型付けされたプログラミング言語λpatを、紹介します。

	We emphasize that there are no new contributions in this section.

	我々は、このセクションに新たな貢献がないことを強調する。

	Instead, we primarily use λpat as an example to show how a type system is developed.

	その代わりに、我々は主に例としてλpat使用型システムが開発されているかを表示します。

	In particularly, we show how various properties of λpat are chained together in order to establish the type soundness of λpat. 

	特に、我々はλpatの様々な特性がλpatの型の健全性を確立するために、一緒に連鎖される方法を示しています。

	The subsequent development of the dependent type system in Section 4 and all of its extensions will be done in parallel to the development of λpat.

	4章とその拡張のすべての依存型システムのその後の開発はλpatの発展に並行して行われる。

	Except Lemma 2.14, all the results in this section are well-known and thus their proofs are　omitted.

	補題2.14を除いて、このセクションのすべての結果は、よく知られているので、それらの証明は省略します。

	----

	- Fig. 3. The syntax for λpat

			base types    δ ::= bool | int | . . .
			types         τ ::= δ | 1 | τ1 ∗ τ2 | τ1 → τ2
			patterns      p ::= x | f | hi | hp1, p2i | cc(p)
			matching clause seq. ms ::= (p1 ⇒ e1 | · · · | pn ⇒ en)
			constants     c ::= cc | cf
			expressions   e ::= xf | c(e) | hi | he1, e2i | fst(e) | snd(e) | case e of ms |
			                    lamx. e | e1(e2) | fix f. e | let x = e1 in e2 end
			values        v ::= x | cc(v) | hi | hv1, v2i | lamx. e
			contexts      Γ ::= · | Γ, xf : τ
			substitutions θ ::= [] | θ[x 7→ v] | θ[f 7→ e]

	The syntax of λpat is given in Figure 3.

	λpatの構文は、図3に示されている。

	We use δ for base types such as int and bool and τ for types.

	我々はint型とブールの基本型用のδと型のτを使用しています。

	We use x for lam-bound variables and f for fix-bound variables, and xf for either x or f.

	我々は、xの為のlam-バインド変数とfにfix-バインドされた変数、およびxかfのいずれかのためにxfを使用しています。

	Given an expression e, we write FV(e) for the set of free variables xf in e, which is defined as usual.

	式eを考えると、我々はいつものように定義されているe内の自由変数の集合 xfをFV（e）と書く。

	----

	A lam-bound variable is considered a value but a fix-bound variable is not.

	lam-バインドされた変数は、値と考えたがfix-バインド変数はありません。

	We use the name observable value for a closed value that does not contain a lambda expression lam x. e as its substructure.

	我々は、その基礎としてラムダ式のlam x. eが含まれていない、閉じた値の名前に観察値を使用します。

	We use c for a constant, which is either a constant constructor cc or a constant function cf .

	我々は、定数コンストラクタccまたは定数関数cfのどちらかである定数、cを使用します。

	Each constant c is assigned a constant type (or c-type, for short) of the form τ ⇒ δ.

	各定数cは、τ⇒δの形の（略して、またはc型）定数型が割り当てられます。
	
	----

	Note that a c-type is not regarded as a (regular) type.

	c型は（レギュラー）型とはみなされないことに注意してください。

	For each constant constructor cc assigned the type 1 ⇒ δ, we may write cc as a shorthand for cc(<>), where <> stands for the unit of the unit type 1.

	型 1 ⇒ δ を割り当てられた各定数コンストラクタccのために、我々は、cc(<>)の省略形として、ccを書き、<>でユニット型1の単位を表します。

	In the following presentation, we assume that the boolean values true and false are assigned the type 1 ⇒ bool and every integer i is assigned the type 1 ⇒ int.

	以下の発表では、trueとfalseのbool値は、1⇒bool型が割り当てられ、すべての整数 i が1⇒int型を割り当てられていることを前提としています。

	Note that we do not treat the tuple constructor <·, ·> as a special case of constructors.

	我々は、コンストラクタの特殊なケースとして、タプルコンストラクタ<·, ·>を扱わないことに注意してください。

	Instead, we introduce tuples into λpat explicitly.

	その代わりに、我々は、明示的にλpatにタプルを導入する。

	The primary reason for this decision is that tuples are to be handled specially in Section 5, where an elaboration procedure is presented for supporting a form of partial type inference in the presence of dependent types.

	このように決めた主な理由は、5章で特別に扱われていますが、タプルの詳細な手順は依存型の存在下で部分的な型推論の形式をサポートするために提示されているためです。

	----

	We use θ for a substitution, which is a finite mapping that maps lam-bound variables x to values and fix-bound variables to fixed-point expressions.

	我々は、固定小数点式に値と固定バインドされた変数にlam-バインドされた変数xをマッピングした有限マッピングである置換のためにθを使用しています。

	We use [] for the empty substitution and θ[xf 7→ e] for the substitution that extends θ with a link from xf to e, where it is assumed that xf is not in the domain dom(θ) of θ.

	我々は、それがxfはθのドメインdom(θ)になっていないことを想定しているxfからeのリンク、とθを拡張置換のための空の置換及びθ[xf 7->e]で[]を使用します。

	Also, we may write [xf1 |-> e1,..., xf n |-> en] for a substitution that maps xf i to ei for 1 ≤ i ≤ n.

	また、我々は1≤i≤nの範囲でxfiからeiへの置換マップを[xf1 |-> e1,..., xf n |-> en]と書くことができます。

	We omit the further details on substitution, which are completely standard.

	我々は完全に標準的な置換に関するさらなる詳細は、省略します。

	Given a piece of syntax • (representing expressions, evaluation contexts, etc.), we use •[θ] for the result of applying θ to •.

	構文•（式や評価コンテキスト等を表す）が与えられたとき、我々はθ を• に適用した結果のために•[θ]を使用する。
	
	----

	We use ∅ for the empty context and Γ, xf : τ for the context that extends Γ with one additional declaration xf : τ , where we assume that xf is not already declared in Γ.

	我々は、空の文脈のため∅使用し、そのxfがすでにΓで宣言されていないと仮定した、Γ, xf：τを追加の宣言 xf:τでΓを拡張するコンテキスト用に使用します。

	A context Γ = ∅, xf: τ1,...,xfn: τn may also be treated as a finite mapping that maps xfi to τi for 1 ≤ i ≤ n, and we use dom(Γ) for the domain of Γ. 

	コンテキストΓ = ∅, xf: τ1,...,xfn: τn もiがn≤1≤用τiはするXFIにマップ有限マッピングとして処理することができる、と我々はΓのドメインのDOM（Γ）を使用します。

	Also, we may use Γ, Γ0 for the context ∅, xf': τ1, ..., xf n : τn, xf' 1 : τ'1,..., xfn: τ n0 , where Γ = ∅, xf 1: τ1, . . . , xf n : τn and Γ0 = ∅, xf'1: τ'1,..., xf' n: τ'n' and all variables xf1,...,xfn,xf'1,...,xf'n' are distinct.

	また、我々は、コンテキスト∅、XFのためΓ、Γ0を使用することができます'：τ1、...、XFのN：τN、XF' 1：τ'1、...、XFN：τN0と、どこΓ=∅、XF 1：τ1、。 。 。 、XFのN：τNとΓ0=∅、xf'1：τ'1、...、XF'N：τ'n'とすべての変数XF1、...、XFN、xf'1、...、XF 'N'は異なります。

	----

	As a form of syntactic sugar, we may write let hx1, x2i = e1 in e2 end for the following expression:

	構文糖の形として、我々は次の式のように let <x1, x2> = e1 in e2 end と書くことがあります:

		let x = e1 in let x1 = fst(x) in let x2 = snd(x) in e2 end end end

	where x is assumed to have no free occurrences in e1, e2.

	ここで、xは、e1とe2に自由変数として出現しないと仮定します。

- 2.1 Static semantics

	We use p for patterns and require that a variable occur at most once in a pattern.

	我々は、パターン用のpを使用し、変数がパターン内に最大1回出現していることが必要です。

	Given a pattern p and a type τ , we can derive a judgment of the form p ↓ τ ⇒ Γ with the rules in Figure 4, which reads that checking pattern p against type τ yields a context Γ.

	パターンpと型τを考えると、我々は、型τに対してパターンpをチェックするコンテキストΓが得られること読み込む図4のルールを持つ`p ↓ τ ⇒ Γ`の形の判断を導出することができます。

		------------- (pat-var)
		x ↓ τ ⇒ x : τ

		------------- (pat-unit)
		<> ↓ 1 ⇒ ∅

		p1 ↓ τ1 ⇒ Γ1   p2 ↓ τ2 ⇒ Γ2
		--------------------------- (pat-prod)
		<p1, p2> ↓ τ1 ∗ τ2 ⇒ Γ1, Γ2

		|- cc(τ):δ    p ↓ τ ⇒ Γ
		----------------------- (pat-const)
		cc(p) ↓ δ ⇒ Γ

		Fig. 4. The typing rules for patterns in λpat

		図.4. λpatにおけるパターンの型付け規則

	Note that the rule (pat-prod) is unproblematic since p1 and p2 cannot share variables.

	p1およびp2は、変数を共有することができないので、ルール(pat-prod)は問題がないことに注意してください。

	Also note that we write |- cc(τ ) : δ in the rule (pat-const) to indicate that cc is a constant constructor of c-type τ ⇒ δ.

	そのCCはC型τの定数コンストラクタはδを⇒であることを示すために、ルール（pat-const）でδ：また、我々は|-CC（τ）を書くことに注意してください。

	As an example, let us assume that intlist is a base type, and nil and cons are constructors of c-types 1 ⇒ intlist and int ∗ intlist ⇒ intlist, respectively; then the following judgments

	例として、我々はそのintlistがベース型であり、ゼロと短所がC-種類それぞれ1⇒のintlistとINT* intlist。⇒intlist、のコンストラクタであると仮定しましょう。次の判決

		Γ(xf) = τ
		------------- (ty-var)
		Γ |- xf : τ

		|- c(τ ) : δ Γ |- e : τ
		--------------------- (ty-const)
		Γ |- c(e) : δ

		----------- (ty-unit)
		Γ |- hi : 1

		Γ |- e1 : τ1 Γ |- e2 : τ2
		----------------------- (ty-prod)
		Γ |- he1, e2i : τ1 ∗ τ2

		Γ |- e : τ1 ∗ τ2
		--------------- (ty-fst)
		Γ |- fst(e) : τ1

		Γ |- e : τ1 ∗ τ2
		--------------- (ty-snd)
		Γ |- snd(e) : τ2

		p ↓ τ1 ⇒ Γ1 Γ, Γ1 |- e : τ2
		-------------------------- (ty-clause)
		Γ |- p ⇒ e : τ1 → τ2

		Γ |- pi ⇒ ei : τ1 → τ2 for i = 1, . . . , n
		------------------------------------------ (ty-clause-seq)
		Γ |- (p1 ⇒ e1 | · · · | pn ⇒ en) : τ1 → τ2

		Γ |- e : τ1 Γ |- ms : τ1 → τ2
		--------------------------- (ty-case)
		Γ |- case e of ms : τ2

		Γ, x : τ1 |- e : τ2
		--------------------- (ty-lam)
		Γ |- lamx. e : τ1 → τ2

		Γ |- e1 : τ1 → τ2 Γ |- e2 : τ1
		---------------------------- (ty-app)
		Γ |- e1(e2) : τ2

		Γ, f : τ |- e : τ
		---------------- (ty-fix)
		Γ |- fix f. e : τ

		Γ |- e1 : τ1 Γ, x : τ1 |- e2 : τ2
		------------------------------- (ty-let)
		Γ |- let x = e1 in e2 end : τ2

		Fig. 5. The typing rules for expressions in λpat

		図5.λpatにおける式の型付け規則


	are derivable:

	の導出は以下のとおりです:

		cons (hx, xsi) ↓ intlist ⇒ x : int, xs : intlist
		cons (hx, nil(hi)i) ↓ intlist ⇒ x : int

	----

	We present the typing rules for expressions in Figure 5.

	我々は、図5の式の型付け規則を提示する。

	The rule (ty-clause) is for assigning types to clauses.

	（TY-句）ルールが句に型を割り当てるためです。

	Generally speaking, a clause p ⇒ e can be assigned the type τ1 → τ2 if e can be assigned the type τ2 under the assumption that p is given the type τ1.

	一般的に言えば、句のp⇒eはタイプを割り当てることができるτ1→τ2電子は、p型のτ1が与えられているという仮定の下型τ2を割り当てることができる場合。

	----

	In the following presentation, given some form of judgment J, we use D :: J for a derivation of J.

	判定J何らかの形の所与の次のプレゼンテーションでは、我々は、Jの導出D:: Jを使用

	The structure of a derivation D is a tree, and we use height(D) for its height, which is defined as usual.

	派生Dの構造は木であり、我々はいつものように定義され、その高さ、のために高さ（D）を使用します。

	----

	The following standard lemma simply reflects that extra assumptions can be discarded in intuitionistic reasoning.

	次の標準補題は単に余分な仮定がbeJournalは関数型プログラミングの9は直観主義的推論に廃棄されたことを反映している。

	It is needed, for instance, in the proof of Lemma 2.3, the Substitution Lemma for λpat.

	それは、補題2.3、λpatの置換補題の証明では、例えば、必要とされる。

	- Lemma 2.1 (Thinning)

		Assume D :: Γ |- e : τ .
	
		D :: Γ |- e : τ を想定。

		Then there is a derivation D0:: Γ, xf : τ0 |- e : τ such that height(D) = height(D0), where τ0 is any well-formed type.

		その後、派生D0::Γ、XFがある：E|-τ0：τよう高さ（D）=高さτ0は任意の整形タイプです（D0）、。

		The following lemma indicates a close relation between the type of a closed value and the form of the value.

		次の補題は、閉じた値の型と値の形の間には密接な関係を示している。

		This lemma is needed to establish Theorem 2.9, the Progress Theorem for λpat.

		この補題はλpatのため定理2.9、進捗定理を確立するために必要とされる。

	- Lemma 2.2 (Canonical Forms)

		Assume that ∅ |- v : τ is derivable.

		1. If τ = δ for some base type δ, then v is of the form cc(v0), where cc is a constant constructor assigned a c-type of the form τ0 ⇒ δ.
		2. If τ = 1, then v is hi.
		3. If τ = τ1 ∗ τ2 for some types τ1 and τ2, then v is of the form hv1, v2i.
		4. If τ = τ1 → τ2 for some types τ1 and τ2, then v is of the form lam x. e.

		Note the need for c-types in the proof of Lemma 2.2 when the last case is handled.

		最後のケースが処理されるとき補題2.2の証明におけるc-タイプの必要性を注意してください。

		If c-types are not introduced, then a (primitive) constant function needs to be assigned a type of the form τ1 → τ2 for some τ1 and τ2.

		のc型が導入されない場合は、（プリミティブ）定数関数は、いくつかのτ1とτ2のフォームτ1→τ2のタイプを割り当てる必要がある。

		As a consequence, we can no longer claim that a value of the type τ1 → τ2 for some τ1 and τ2 must be of the form lamx. e as the value may also be a constant function. 

		結果として、我々はもはや一部τ1とτ2の型τ1→τ2の値がフォームlamxでなければならないと主張することはできません。値として電子も一定関数であってもよい。

		So the precise purpose of introducing c-types is to guarantee that only a value of the form lam x. e can be assigned a type of the form τ1 → τ2.

		だから、C-タイプを導入する正確な目的は、フォームのラメxのその値だけを保証することです。 eはフォームτ1→τ2のタイプを割り当てることができます。

		----

		Given Γ, Γ0 and θ, we write Γ |- θ : Γ0 to indicate that Γ |- θ(xf) : Γ0(xf) is derivable for each xf in dom(θ) = dom(Γ0).

		Γ、Γ0を考えると、θ、我々はΓは|-θ書く：Γ0（XF）はDOM（θ）= DOMの各XF（Γ0）のために誘導可能である：Γ0はΓは|-θ（XF）があることを示すために。

		The following lemma is often given the name Substitution Lemma, which is needed in the proof of Theorem 2.8, the Subject Reduction Theorem for λpat.

		次の補題は、多くの場合、定理2.8、λpatための件名削減定理の証明で必要とされる名置換補題を、与えられている。

	- Lemma 2.3 (Substitution)

		Assume that Γ |- θ : Γ0 holds.

		Γ0が成り立つ：Γ|-θがあるとします。

		If Γ, Γ0 |- e : τ is derivable, then Γ |- e[θ] : τ is also derivable.

		τ導出され、その後Γ|-E [θ]：Γ、Γ0|- eがあればτも誘導可能である。

- 2.2 Dynamic semantics

	We assign dynamic semantics to expressions in λpat through the use of evaluation contexts defined as follows.

	我々は次のように定義された評価コンテキストを使用することによりλpatにおける式への動的なセマンティクスを割り当てる。

	----

	- Definition 2.4 (Evaluation Contexts)
	- 定義2.4（評価コンテキスト）

			evaluation contexts E ::= [] | c(E) | hE, ei | hv, Ei | fst(E) | snd(E) |
			case E of ms | E(e) | v(E) | let x = E in e end

		We use FV(E) for the set of free variables xf in E.

		我々は、Eにおける自由変数のXFのセットFV（E）を使用します

		Note that every evaluation context contains exactly one hole [] in it.

		すべての評価コンテキストがそれに正確に一つの穴[]が含まれていることに注意してください。

		Given an evaluation context E and an expression e, we use E[e] for the expression obtained from replacing the hole [] in E with e.

		評価コンテキストEと式eを考えると、我々が使用するE [E]の穴を交換から得られた発現のために[] EとE中。

		As the hole [] in no evaluation context can appear in the scope of a lam-binder or a fix-binder, there is no issue of capturing free variables in such a replacement.

		無評価コンテキストの穴[]は、LAM-バインダーまたはFIX-バインダーのスコープに表示できるように、このような交換に自由変数をキャプチャは問題ありません。

			match(v, x) ⇒ [x 7→ v]
			(mat-var)
			match(hi, hi) ⇒ [] (mat-unit)
			match(v1, p1) ⇒ θ1 match(v2, p2) ⇒ θ2
			match(hv1, v2i, hp1, p2i) ⇒ θ1 ∪ θ2
			(mat-prod)
			match(v, p) ⇒ θ
			match(c(v), c(p)) ⇒ θ
			(mat-const)

		Fig. 6. The pattern matching rules for λpat

		図6.λpatためのルールのパターンマッチング

		----

		Given a pattern p and a value v, a judgment of the form match(v, p) ⇒ θ, which means that matching a value v against a pattern p yields a substitution for the variables in p, can be derived through the application of the rules in Figure 6.

		パターンpに対する値vに一致するページ内の変数の置換を生じることを意味するパターンpと値v、フォーム一致の判定（V、P）θを⇒を、所与のアプリケーションを介して誘導することができる図6のルール。
		
		Note that the rule (mat-prod) is unproblematic because p1 and p2 can share no common variables as hp1, p2i is a pattern.

		P1およびP2はHP1として共通の変数を共有することはできませんので、ルール（マット-PROD）は問題がないことに注意してください、P2Iはパターンです。

	- Definition 2.5
	- 定義2.5
	
		We define evaluation redexes (or ev-redex, for short) and their reducts in λpat as follows:

		次のように我々は、評価redexes（またはEV-可約式、ショート用）とλpatでの縮約を定義します。	

		• fst(hv1, v2i) is an ev-redex, and its reduct is v1.
		• snd(hv1, v2i) is an ev-redex, and its reduct is v2.
		• (lam x. e)(v) is an ev-redex, and its reduct is e[x 7→ v].
		• fix f. e is an ev-redex, and its reduct is e[f 7→ fix f. e].
		• let x = v in e end is an ev-redex, and its reduct is e[x 7→ v].
		• case v of (p1 ⇒ e1 | · · · | pn ⇒ en) is an ev-redex if match(v, pk) ⇒ θ is derivable for some 1 ≤ k ≤ n, and its reduct is ek[θ].
		• cf(v) is an ev-redex if (1) v is an observable value and (2) cf(v) is defined to be some value v0.

		In this case, the reduct of cf(v) is v0.
		この場合、CFの縮約(reduct)（v）はV0である。

		Note that a value is observable if it does not contain any lambda expression lamx. e as its substructure.
		
		それは、その下部構造などの任意のラムダ式のlam x.e が含まれていない場合、値が観測可能であることに注意してください。

		The one-step evaluation relation ,→ev is defined as follows:
		以下の通りのev→ワンステップ評価関係が定義される：

		We write e1 ,→ev e2 if e1 = E[e] for some evaluation context E and ev-redex e, and e2 = E[e0], where e0 is a reduct of e.

		我々は、E1、→EV E2書くとE0はEの縮約(reduct)であるいくつかの評価コンテキストEとEV-可約式E、とe2= E [E0]、のためのE1= E[E]が。

		We use ,→∗ ev for the reflexive and transitive closure of ,→ev and say that e1 ev-reduces (or evaluates) to e2 if e1 ,→∗ ev e2 holds.

		我々は、EV→、の反射的と推移閉包のために→* EV、使用して保持→* EV E2、E1場合にE1のE2にEVは-削減（または評価する）と言う。

		There is certain amount of nondeterminism in the evaluation of expressions: case v of ms may reduce to e[θ] for any clause p ⇒ e in ms such that match(v, p) ⇒ θ is derivable.

		非決定性の一定量は、式の評価にあります：MSの場合Vは、MS内の任意の句pは⇒Eの[θ]メールにそのようなマッチ（V、P）は、θが導出可能である⇒ことを減らすことができる。

		This form of nondeterminism can cause various complications, which we want to avoid in the first place.

		非決定性のこの形式は、我々は最初の場所で避けたいさまざまな合併症を引き起こす可能性があります。

		In this paper, we require that the patterns p1, . . . , pn in a matching clause sequence (p1 ⇒ e1 | · · · | pn ⇒ en) be disjoint, that is, for 1 ≤ i 6= j ≤ n, there are no values v that can match both pi and pj .

		本稿では、パターンがP1いる必要があります。 。 。 、マッチング句シーケンスのpn（P1。⇒e1は|···| PN⇒JA）1≤I 6= Jの≤nについて、PIとPJの両方を一致させることができない値Vが存在しない、つまり、互いに素である。

		----

		In the actual implementation, we do allow overlapping patterns in a matching clause sequence, and we avoid nondeterminism by performing pattern matching in a deterministic sequential manner.

		実際の実装では、関数型プログラミング11のジャーナルは、我々は、一致する句シーケンスでパターンの重複が可能か、と我々は決定論順次パターンマッチングを実行することによって、非決定性を避ける。

		We could certainly do the same in the theoretical development, but this may complicate the evaluation of open programs, that is, programs containing free variables.

		我々は確かに理論的な発展に同じ行うことができますが、これは開いているプログラムの評価を複雑にする、それは自由な変数を含むプログラムは、です。

		For instance, let e1 and e2 be the following expressions case cons(x, xs) of (nil ⇒ true | x 0 ⇒ false) and case x of (nil ⇒
		true | x 0 ⇒ false), respectively.

		例えば、E1せ、E2は（nil以外の真⇒| X 0⇒偽）の以下の式ケース短所（X、XS）であること（NILの⇒のXとケース
		真|それぞれx偽0⇒）、。

		Clearly, we should evaluate e1 to false, but we should not evaluate e2 to false as we do not know whether x matches nil or not.

		明らかに、我々はfalseにE1を評価する必要がありますが、我々は、Xがnilかどう一致するかどうかわからないように、我々はfalseにE2を評価するべきではありません。

		This complication is simply avoided when patterns in a matching clause sequence are required to be disjoint.

		マッチング句シーケンスのパターンが互いに素であることが要求される場合、この合併症は、単純に回避される。

		----

		The meaning of a judgment of the form p ↓ τ ⇒ Γ is captured precisely by following lemma.
		
		フォームのp↓τの判断の意味は、Γが補題に追従して正確に捕捉される⇒。

	- Lemma 2.6
	
		Assume that the typing judgment ∅ ` v : τ is derivable. If p ↓ τ ⇒ Γ and match(v, p) ⇒ θ are derivable, then ∅ ` θ : Γ holds.

	- Definition 2.7
	- 定義2.7

		We introduce some forms to classify closed expressions in λpat.

		我々は、λpatで、閉じた表現を分類するためにいくつかのフォームをご紹介します。

		Given a closed expression e in λpat, which may or may not be well-typed,

		または十分に型付けされてもされなくてもよいλpatで、閉じた式eが与えられると、
		
		• e is in V-form if e is a value.
		• e is in R-form if e = E[e0] for some evaluation context E and ev-redex e0. So if e is in R-form, then it can be evaluated further.
		• e is in M-form if e = E[case v of ms] such that case v of ms is not an ev-redex. This is a case where pattern matching fails because none of the involved patterns match v.
		• e is in U-form if e = E[cf(v)] and cf(v) is undefined. For instance, division by zero is such a case.
		• e is in E-form otherwise. We will prove that this is a case that can never occur during the evaluation of a well-typed program.
		
		We introduce three symbols Error, Match and Undefined, and use EMU for the set {Error,Match, Undefined} and EMUV for the union of EMU and the set of observable values. We write e ,→∗
		ev Error, e ,→∗
		ev Match and e ,→∗
		ev Undefined
		if e ,→∗
		ev e
		0
		for some e
		0
		in E-form, M-form and U-form, respectively.

		----

		It can be readily checked that the evaluation of a (not necessarily well-typed) program in λpat may either continue forever or reach an expression in V-form, Mform, U-form, or E-form.

		それは容易になりλpatでの評価（必ずしも十分に型付けされた）プログラムは永遠に継続するか、V-形、Mform、U-フォーム、またはE-形で式に達する可能性がどちらかことを確認することができます。

		We will show that an expression in E-form can never be encountered if the evaluation starts with a well-typed program in λpat.

		我々は、評価がλpatではよく型付けされたプログラムで始まる場合は、E-形で式に遭遇することはできませんと表示されます。

		This is precisely the type soundness of λpat.

		これは正確にλpatのタイプの健全性である。

- 2.3 Type soundness 型健全性

	We are now ready to state the subject reduction theorem for λpat, which implies that the evaluation of a well-typed expression in λpat does not alter the type of the expression.

	現在λpatではwell-typedな式の評価が式の型を変更しないことを意味しているλpatの対象還元定理(subject reduction theorem)を、明記する準備が整いました。

	----

	For each constant function cf of c-type τ ⇒ δ, if ∅ ` v : τ is derivable and c(v) is defined to be v0, then we require that ∅ ` v0 : δ be also derivable.

	`∅ |- v : τ`は導出可能であり、`c(v)`が、`v0`であると定義されている場合は、c-type `τ ⇒ δ` の各定数関数のcfのために、私たちは`∅ |- v0 : δ`が導き出せるもあることを必要とする。

	In other words, we require that each constant function meet its specification, that is, the c-type assigned to it.

	言い換えれば、我々は、各定数関数、すなわち、`c-type`が割り当てられ、その仕様を満たしていることを必要とする。

	- Theorem 2.8 (Subject Reduction)
	- 定理 2.8 (対称還元)

		Assume that ∅ |- e1 : τ is derivable and e1 ,→ev e2 holds.

		`∅ |- e1 : τ`を導出可能で、`e1,->ev e2`を保持すると仮定します。

		Then `∅ |- e2 : τ` is also derivable.

		その後`∅ |- e2 : τ`も導出可能である。

		Lemma 2.3 is used in the proof of Theorem 2.8.

		補題2.3は定理2.8の証明に使用されている。

	- Theorem 2.9 (Progress)
	- 定理 2.9 (推移)

		Assume that `∅ |- e1 : τ` is derivable.

		`∅ |- e1 : τ`が導出出来ると仮定します。

		Then there are only four possibilities:

		その後、4つのみの可能性がある:

		- e1 is a value, or
		- e1 is in M-form, or
		- e1 is in U-form, or
		- e1 ,→ev e2 holds for some expression e2.

		Note that it is implied here that e1 cannot be in E-form.

		e1は、E-formであることができないことをここで暗黙的に示されていることに注意してください。

		Lemma 2.2 is needed in the proof of Theorem2.9.

		補題2.2はTheorem2.9の証明で必要とされる:

		----

		By Theorem 2.8 and Theorem 2.9, we can readily claim that for a well-typed closed expression e, either e evaluates to a value, or e evaluates to an expression in M-form, or e evaluates to an expression in U-form, or e evaluates forever.

		定理2.8と定理2.9により、我々は容易にwell-typedな型付けされ閉じられた式eのため、eが値に評価されるか、eはM-formで表現と評価されるか、またはeは、U-form で式に評価されているか、またはeは永遠に評価されることのいずれかを主張することができます。

		In particular, it is guaranteed that e ,→∗ ev Error can never happen for any well-typed expression e in λpat.

		特に、`e, →* ev` エラー が λpat内の任意のwell-typedな式eのために決して起こらないことが保証されている。

- 2.4 Operational equivalence

	We will present an elaboration procedure in Section 5, which maps a program written in an external language into one in an internal language.

	私たちは、5章でその内部言語で一つに外部言語で書かれたプログラムをマップする詳細な手順を紹介します。

	We will need to show that the elaboration of a program preserves the operational semantics of the program.

	我々は、プログラムの詳細化は、プログラムの操作的意味を保持していることを示す必要があります。

	For this purpose, we first introduce the notion of general contexts as follows:

	この目的のために、まず一般的なコンテキストの概念を次のように導入します:

		general contexts G ::=
			[] | c(G) | hG, ei | he, Gi | fst(G) | snd(G) | lam x. G | G(e) | e(G) |
			case G of (p1 ⇒ e1 | · · · | pn ⇒ en) |
			case e of (p1 ⇒ e1 | · · · | pi−1 ⇒ ei−1 | pi ⇒ G | pi+1 ⇒ ei+1 | · · · | pn ⇒ en) |
			fix f. G | let x = G in e end | let x = e in G end

	Given a general context G and an expression e, G[e] stands for the expression obtained from replacing with e the hole [] in G.

	一般的な文脈Gおよび式eを考えると、G[e]はG内のeとホール[]の置換で得られた式を意味する。

	We emphasize that this replacement may capture free variables in e.

	我々は、この置換はe内の自由変数を取り込むことができることを強調する。

	For instance, G[x] = lamx. x if G = lam x. [].

	例えば、G = lam x. []の場合 G[x]= lamx. x です。

	The notion of operational equivalence can then be defined as follows.

	次のように運用等価の概念は、次のように定義することができる。

	- Definition 2.10
	- 定義 2.10

		Given two expressions e1 and e2 in λpat, which may contain free variables, we say that e1 is operationally equivalent to e2 if the following holds.

		二つの式e1と自由変数を含むことができるλpat中のe2を考えると、以下が保持している場合は我々はe1はe2に操作上等価であると言います。

		- Given any context G, G[e1] ,→∗ ev v∗ holds if and only if G[e2] ,→∗ ev v∗ , where v∗ ranges over EMUV, that is, the union of EMU and the set of observable values.

		We write e1 ∼= e2 if e1 is operationally equivalent to e2, which is clearly an equivalence relation.

		----

		Unfortunately, this operational equivalence relation is too strong to suit our purpose.

		The reason can be explained with a simple example. Suppose we have a program lamx : int ∗ int. x in which the type int ∗ int is provided by the programmer;

		for some reason (to be made clear later), we may elaborate the program into the following one:

			e = lamx. let hx1, x2i = x in hx1, x2i end

		Note that if we erase the type int ∗ int in the original program, we obtain the expression lamx. x, which is not operationally equivalent to e; for instance they are distinguished by the simple context G = [](hi).

		我々は、元のプログラムで型にint * int型を消去した場合、我々は表現lamxを得ることに注意してください。 X、Eに操作上等価でされていない。例えば、それらは、単純なコンテキストG=[]（ハイ）で区別される。

		To address this rather troublesome issue, we introduce a reflexive and transitive relation ≤dyn on expressions in λpat.

		このかなり厄介な問題に対処するために、我々はλpatの式に≤dyn反射的かつ推移的な関係を紹介する。

	- Definition 2.11
	- 定義 2.11

		Given two expressions e1 and e2 in λpat, which may contain free variables, we say that e1 ≤dyn e2 holds if for any context G,

		二つの式E1を考えると自由変数を含むことができるλpatでE2、我々は、E1≤dynE2はG任意のコンテキストのための場合、保持していることを言う

		- either G[e2] ,→∗ ev Error holds, or
		- G[e1] ,→∗ ev v∗ if and only if G[e2] ,→∗ ev v∗, where v∗ ranges over EMUV, that is, the union of EMU and the set of observable values.

		つまり、EMUVの上の範囲、EMUの労働組合と観測可能な値のセット。

		It is straightforward to verify the reflexivity and transitivity of ≤dyn.

		それは≤dynの反射性と推移性を検証することは簡単である。

	- Corollary 2.12

		Assume that e1 ≤dyn e2 holds. For any context G such that G[e2] is a closed welltyped expression in λpat, G[e1] evaluates to v ∗ if and only if G[e2] evaluates to v∗, where v∗ ranges over EMUV.

	- Proof

		This simply follows the definition of ≤dyn and Theorem 2.9. □

		これは、単に≤dynと定理2.9の定義を以下の通り。

		----

		In other words, e1 ≤dyn e2 implies that e1 and e2 are operationally indistinguishable in a typed setting.

		つまり、E1≤dynE2ではe1とe2が型付き設定で操作上区別できないことを意味している。

		We now present an approach to establishing the relation ≤dyn in certain special cases.

		我々は現在、特定の特別な場合には関係≤dynの確立へのアプローチを提示する。

	- Definition 2.13

		We define general redexes (or g-redexes, for short) and their reducts in λpat as follows:

		- An ev-redex is a g-redex, and the reduct of the ev-redex is also the reduct of the g-redex.
		- let x = e in E[x] end is a g-redex if x has no free occurrences in E, and its reduct is E[e].

		- hfst(v), snd(v)i is a g-redex and its reduct is v.

			index signatures S ::= ∅ | S, C : (s1, . . . , sn) ⇒ s
			index base sorts b ::= bool | . . .
			index sorts s ::= b | s1 ∗ s2 | s1 → s2
			index terms I ::= a | C(I1, . . . , In) | hI1, I2i | π1(I) | π2(I) |
			λa : s. I | I1(I2)
			index contexts φ ::= ∅ | φ, a : s
			index substitutions Θ ::= [] | Θ[a 7→ I]

		- Fig. 7. The syntax for a generic type index language

				φ(a) = s
				φ ` a : s
				(st-var)
				S(C) = (s1, . . . , sn) ⇒ s φ ` Ik : sk for 1 ≤ k ≤ n
				φ ` C(I1, . . . , In) : s
				(st-const)
				φ ` I1 : s1 φ ` I2 : s2
				φ ` hI1, I2i : s1 ∗ s2
				(st-prod)
				φ ` I : s1 ∗ s2
				φ ` π1(I) : s1
				(st-fst) φ ` I : s1 ∗ s2
				φ ` π2(I) : s2
				(st-snd)
				φ, a : s1 ` I : s2
				φ ` λa : s1. I : s1 → s2
				(st-lam)
				φ ` I1 : s1 → s2 φ ` I2 : s1
				φ ` I1(I2) : s2
				(st-app)

		- Fig. 8. The sorting rules for type index terms

		- lamx. v(x) is a g-redex and its reduct is v.

		We write e1 ,→g e2 if e1 = G[e] for some general context G and g-redex e, and e2 = G[e0], where e0 is a reduct of e. We use ,→∗ g for the reflexive and transitive closure of ,→g and say that e1 g-reduces to e2 if e1 ,→∗ g e2 holds.

		我々は、E1、→G E2書くE1= G [E]場合E0はEの縮約であるいくつかの一般的な文脈GおよびG-可約式E、とe2= G [E0]、のために。我々は→gを、の反射的と推移閉包のために、→* Gを使用して、→* GのE2が保持して、E1場合にE1のE2にgは-軽減言う。

		We now mention a lemma as follows:

		我々は今次のように補題に言及します：

	- Lemma 2.14

		Given two expressions e and e0 in λpat that may contain free variables, e ,→∗ g e0 implies e0 ≤dyn e.

		二つの式 eと自由変数を含むことができるλpatでe0を考えるとき `e, →* g e0`は、e0 ≤ dyn e を意味します。

	- Proof
	- 証明

		A (lengthy) proof of the lemma is given in Appendix A.

		補題の（長い）証明は付録Aに記載されています。

		----

		This lemma is to be of important use in Section 5, where we need to establish that the dynamic semantics of a program cannot be altered by elaboration.

		この補題は、我々はプログラムの動的な意味論を精緻化することによって変更することができないことを確立する必要があり、5章中で重要な役割りを持つ。

- 3 Type index language

	We are to enrich λpat with a restricted form of dependent types.

	我々は、依存型の制限された形でλpat豊かにするである。

	The enrichment is to parameterize over a type index language from which type index terms are drawn.

	濃縮は、タイプの索引語が描画されるからタイプインデックスの言語を上にパラメータ化することです。

		φ; P~ |= true
		(reg-true)
		φ; P~ , false |= P
		(reg-false)
		φ; P~ |= P0
		φ, a : s; P~ |= P0
		(reg-var-thin)
		φ ` P : bool φ; P~ |= P0
		φ; P~ , P |= P0
		(reg-prop-thin)
		φ, a : s; P~ |= P φ ` I : s
		φ; P~ [a 7→ I] |= P[a 7→ I]
		(reg-subst)
		φ; P~ |= P0 φ; P~ , P0 |= P1
		φ; P~ |= P1
		(reg-cut)
		φ ` I : s
		φ; P~ |= I
		.
		=s I
		(reg-eq-refl)
		φ;P~ |= I1
		.=s I2
		φ;P~ |= I2
		.
		=s I1
		(reg-eq-symm)
		φ; P~ |= I1
		.=s I2 φ; P~ |= I2
		.=s I3
		φ; P~ |= I1
		.=s I3
		(reg-eq-tran)

		Fig. 9. The regularity rules

	In this section, we show how a generic type index language L can be formed and then present some concrete examples of type index languages. 

	For generality, we will include both tuples and functions in L.

	However, we emphasize that a type index language can but does not necessarily have to support tuples or functions.

	----

	The generic type index language L itself is typed. In order to avoid potential confusion, we call the types in L type index sorts (or sorts, for short).


	fig 7.

		b: base sorts. bool or ...
		C: constant sort = c-sort = (s1, . . ., sn) -> b 

	We use a for index variables and C for constants, which are either constant functions or constant constructors.
	
	Each constant is assigned a constant sort (or c-sort, for short) of the form (s1, . . . , sn) ⇒ b, which means that C(I1, . . . , In) is an index term of sort b if Ii are of sorts si for i = 1, . . . , n.


	インスタンス

	For instance, true and false are assigned the c-sort () ⇒ bool. We may write C for C() if C is a constant of c-sort () ⇒ b for some base sort b.

	シグニチャS

	We assume that the c-sorts of constants are declared in some signature S associated with L, and for each sort s, there is a constant function .=s of the c-sort (s, s) ⇒ bool.

	.=

	We may use .= to mean .=s for some sort s if there is no risk of confusion.

	Fig 8.

	----

	We present the sorting rules for type index terms in Figure 8, which are mostly standard.

	我々は、ほとんどが標準的である図8のタイプインデックスの用語、のソートルールを提示する。

	We use P for index propositions, which are index terms that can be assigned the sort bool (under some index context φ), and P~ for a sequence of propositions, where the ordering of the terms in this sequence is of no significance.

	我々は、このシーケンスの条件の順序は重要ではない命題のシーケンスのために（いくつかの指標のコンテキストφ下）ソートBOOLを割り当てることができますインデックス用語であるインデックス命題、およびP〜のためにPを使用しています。

	----

	We may write φ |- P~ : bool to mean that φ |- P : bool is derivable for every P in P~.

	BOOLがP内のすべてのP〜のために誘導可能である：P - |それはφ意味するBOOL：P〜 - |我々は、φを書き込むことができる。

	In addition, we may use φ |- Θ : φ0 to indicate that φ |- Θ(a) : φ0(a) holds for each a in dom(Θ) = dom(φ0).

	また、我々はφを使用することがあります| - Θ：φ0はそれがφを示すために| - Θ（A）：φ0（a）の各AのDOM（Θ）= DOM（φ0）についても同様である。

- 3.1 Regular constraint relation

- 3.1 正規制約関係

	A constraint relation φ; P~ |= P0 is defined on triples φ, P~, P0 such that both φ |-
	P~ : bool and φ |- P0 : bool are derivable.

	制約関係（ φ ; P 〜 | = P0 ）は３つの（ φ 、 P 〜 、 P0）で定義されており、（ φ| - 
	P 〜：ブール値）と（ φ| - P0：ブール値）両方が導出可能である。

	We may also write φ; P~ |= P~0 to mean that　φ; P~ |= P0 holds for each P0 in P~0.

	我々はまた、（ φ ; P~ | = P~0 ）と書くことが（ φ ; P~ | = P0） ことを意味していて P~0の各P0についても同様である。

	We say that a constraint relation φ; P~ |= P0 is　regular if all the regularity rules in Figure 9 are valid, that is, the conclusion of a　regularity rule holds whenever all the premises of the regularity rule do.

	図9のすべての規則性の規則が有効であるか|; （ = P0 P 〜 φ ）それは、規則性ルールの結論は規則性ルールのすべての施設が行うたびに保持され、規則的である我々は、制約関係があることを言う。

	我々は、図9のすべての規則性の規則が有効な場合、制約関係 φ; P~ |= P0 はつまり、規則性ルールの結論は規則性ルールのすべての施設が行うたびに保持され、定期的であると言う。

		----------------(reg-true)
		φ; P~ |= true

	命題の集まりPはtrueが導出出来る。

		----------------(reg-false)
		φ; P~,false |= P

	P~,falseは存在する。

		φ; P~ |= P0
		----------------(reg-var-thin)
		φ,a:s; P~ |= P0


	変数が加わっても同じ。


		φ|- P:bool      φ;P~ |= P0
		--------------------------(reg-prop-thin)
		φ,a:s; P~ |= P0

	Pが命題で、制約関係φでP~にP0の制約関係があるならば
	変数が加わっても制約関係φでP~にP0は変わらない。


		φ,a:s;P~ |= P        φ |- I:s
		-----------------------------(reg-subst)
		φ; P~[a |-> I ] |= P[a |-> I]

	型がsの変数aが環境内にあってP~ |= Pで φ 内に変数 I:sがあるとき

		φ; P~[a |-> I ] |= P[a |-> I]

	命題の集合のP~内のaがIならP内のaもIだ。 


		φ;P~ |= P0      φ;P~,P0 |- P1
		-----------------------------(reg-cut)
		φ; P~ |= P1

	φ;P~ |= P0かつφ;P~,P0 |- P1ならφ; P~ |= P1だ。


	Note that　the rules (reg-eq-refl), (reg-eq-symm) and (reg-eq-tran) indicate that for each　sort s, .=s needs to be interpreted as an equivalence relation on expressions of the　sort s.

	ルール（REG-EQ-REFL）、（REG-EQ-SYMM）と（REG-EQ-TRAN）は各ソート s、.= Sはソートsの式に同値関係として解釈される必要があることを示していることに注意してください。

		φ |- I:s
		----------------(reg-eq-refl)
		φ; P~ |= I .= I

	反射率

		φ;P~ |= I1 .= I2
		----------------(reg-eq-symm)
		φ;P~ |= I2 .= I1

	対称律

		φ;P~ |= I1 .= I2     φ;P~|= I2 .= I3
		------------------------------------(reg-eq-tran)
		φ; P~ |= I1 .= I3

	推移律

	３つまとめて、同値関係

	----

	Essentially, we want to treat a constraint relation as an abstract notion. 

	基本的に、我々は、抽象概念としての制約関係を扱いたい。

	However,　in order to use it, we need to specify certain properties it possesses, and this is　precisely the motivation for introducing regularity rules.

	しかし、それを使用するために、我々はそれが有する特定のプロパティを指定する必要があり、これは正確に規則性ルールを導入するための動機である。

	For instance, we need the regularity rules to prove the following lemma.

	たとえば、我々は次の補題を証明するために規則の規則を必要とする。


	- Lemma 3.1 (Substitution)

		- Assume φ, φ0; P~ |= P0
			and φ |- Θ : φ0.        Then φ; P~ [Θ] |= P0[Θ] holds.
		- Assume φ; P~ , P~0 |= P0
			and φ; P~       |= P~0. Then φ; P~     |= P0    holds.

	Note that these two properties are just simple iterations of the rules (reg-subst) and (reg-cut).

	これらの2つのプロパティのルール（REG-SUBST）と（REGカット）の単純な繰り返しがあることに注意してください。

	----

	In the rest of this section, we first present a model-theoretic approach to establishing the consistency of a regular constraint relation, and then show some concrete examples of type index languages.

	このセクションの残りの部分では、まず、通常の制約関係の整合性を確立するモデル理論アプローチを提示してから、タイプインデックス言語のいくつかの具体例を示している。

	At this point, an alternative is for the reader to proceed directly to the next section and then return at a later time.

	読者は、次のセクションに直接進むと、後で返すようにするためにこの時点で、代替案がある。

- 3.2 Models for type index languages

	We now present an approach to constructing regular constraint relations for type index languages.

	現在タイプインデックス言語の定期的な制約関係を構築するためのアプローチを提示。

	The approach, due to Henkin (Henkin, 1950), is commonly used in the construction of models for simple type theories.

	ヘン（ヘン、1950）によるアプローチは、一般的に単純型理論のモデルの作成に使用される。

	The presentation of this approach given below is entirely adopted from Chapter 5 (Andrews, 1986).

	下記のこのアプローチのプレゼンテーションでは、完全に、第5章（アンドリュース、1986）から採用されている。

	Also, some details on constructing Henkin models can be found in (Andrews, 1972; Mitchell & Scott, 1989).

	（;ミッチェル＆スコット、1989アンドリュース、1972）。また、ヘンケンモデルを構築する上で、いくつかの詳細が記載されています。

	----

	We use D for domains (sets).

	我々は、ドメイン（セット）のためにDを使用しています。

	Given two domains D1 and D2, we use D1 × D2 for the usual product set {ha1, a2i | a1 ∈ D1 and a2 ∈ D2}, and π1 and π2 for the standard projection functions from D1 × D2 to D1 and D2, respectively.

	それぞれD1およびD2、D1から×D2から標準の投影機能用、およびπ1とπ2|つのドメインD1およびD2を考えると、我々は通常の製品セット{A1∈D1とa2∈D2 HA1、a2i}のためにD1×D2を使用。

	----

	Let sort be the (possibly infinite) set of all sorts in L.

	ソートL.におけるあらゆる種類の（おそらく無限の）集合とする

	A frame is a collection {Ds}s∈sort of nonempty domains Ds, one for each sort s.


	フレームが空でないドメインのDS、各ソートsの1のコレクション{Dsは}s∈sortです。

	We require that Dbool = {tt, ff}, where tt and ff refer to two distinct elements representing truth and falsehood, respectively, and Ds1∗s2 = Ds1 × Ds2 and Ds1→s2 be some collection of functions from Ds1 to Ds2 (but not necessarily all the functions from Ds1 to Ds2).

	我々は、Dbool={TTは、FF}、TTはとFFそれぞれ、真実と虚偽を表す2つの異なる要素を参照してくださいどこにする必要があり、およびDS1* S2 = Ds1を×Ds2におよびDS1→S2（Ds2とのDs1をから機能の一部収集をすることが、 Ds1がからDs2のに必ずしもすべての機能）。

	An interpretation h{Ds}s∈sort, Ii of L consists of a frame {Ds}s∈sort and a function I that maps each constant C of c-sort (s1, . . . , sn) ⇒ b to a function I(C) from Ds1 × . . . × Dsn into Db (or to an element in Db if n = 0), where b stands for a base sort.

	In particular, we require that
	
	- I(true) = tt and I(false) = ff, and
	- I(.=s) be the equality function of the domain Ds for each sort s.
	
	Assume that the arity of a constructor C is n. Then C(I1, . . . , In) .= C(I0 1, . . . , I0 n)　implies that Ii .= I0 i for 1 ≤ i ≤ n. Therefore, for each constructor C, we require that I(C) be an injective (a.k.a. 1-1) function.

	----

	An assignment η is a finite mapping from index variables to D = ∪s∈sortDs, and we use dom(η) for the domain of η. As usual, we use [] for the empty mapping and η[a 7→ a] for the mapping that extends η with one additional link from a to a, where a 6∈ dom(η) is assumed.

	We write η : φ if η(a) ∈ Dφ(a) holds for each a ∈ dom(η) = dom(φ).

	An interpretation M = h{Ds}s∈sort, Ii of S, which is the signature associated with L, is a model for L if there exists a (partial) binary function VM such that for each assignment η satisfying η : φ for some φ and each index term I, VM(η, I) is properly defined such that VM(η, I) ∈ Ds holds whenever φ ` I : s is derivable for some sort s, and the following conditions are also met:

	1. VM(η, a) = η(a) for each a ∈ dom(η), and
	2. VM(η, C(I1, . . . , In)) = I(C)(VM(η, I1), . . . , VM(η, In)), and
	3. VM(η,hI1, I2i) = hVM(η, I1), VM(η, I2)i, and
	4. VM(η, π1(I)) = π1(VM(η, I)) whenever φ ` I : s1 ∗ s2 is derivable for some sorts s1 and s2, and
	5. VM(η, π2(I)) = π2(VM(η, I)), whenever φ ` I : s1 ∗ s2 is derivable for some sorts s1 and s2, and
	6. VM(η, I1(I2)) = VM(η, I1)(VM(η, I2)) whenever φ ` I1(I2) : s is derivable for some sort s, and
	7. VM(η, λa : s1.I) is the function that maps each element a in the domain Ds1 to VM(η[a 7→ a], I) whenever φ ` λa : s1.I : s1 → s2 is derivable for some sort s2.

	Note that not all interpretations are models (Andrews, 1972).

	Given a model M for L, we can define a constraint relation |=M as follows: φ; P~ |=M P0 holds if and only if for each assignment η such that η : φ holds, VM(η, P0) = tt or VM(η, P) = ff for some P ∈ P~ .

	- Proposition 3.2

		The constraint relation |=M is regular.

	- Proof

		It is a simple routine to verify that each of the regularity rules listed in Figure 9 is valid.　□
		
	Therefore, we have shown that for any given type index language L, there always exists a regular constraint relation if a model can be constructed for L.

	Of course, in practice, we need to focus on regular constraint relations that can be decided in an algorithmically effective manner.

- 3.3 Some examples of type index languages

- 3.3.1 A type index language Lalg

	We now describe a type index language Lalg in which only algebraic terms can be formed.

	Suppose that there are some base sorts in Lalg .

	For each base sort b, there exists some constructors of c-sorts (b1, . . . , bn) ⇒ b for constructing terms of the base sort b, and we say that these constructors are associated with the sort b.

	In general, the terms in Lalg can be formed as follows, index terms I ::= a | C(I1, . . . , In) where C is a constructor or an equality constant function .=s for some sort s.

	For instance, we may have a sort Nat and two constructors Z and S of c-sorts () ⇒ Nat and (Nat) ⇒ Nat, respectively, for constructing terms of sort Nat.

	A constraint in Lalg is of the following form:

		a1 : b1, . . . , an : bn; I1 .= I 0 1 , . . . , In .= I 0 n |= I .= I 0

	where each .= is .=s for some sort s.

	A simple rule-based algorithm for solving this kind of constraints can be found in (Xi et al., 2003), where algebraic terms are used to represent types.

	----

	In practice, we can provide a mechanism for adding into Lalg a new base sort b as well as the constructors associated with b.

	As an example, we may use the following concrete syntax:

		datasort stp =
		Bool | Integer | Arrow of (stp, stp) | Pair of (stp, stp)

	to introduce a sort stp and then associate with it some constructors of the following c-sorts:

		Bool : () ⇒ stp
		Integer : () ⇒ stp
		Arrow : (stp, stp) ⇒ stp
		Pair : (stp, stp) ⇒ stp

	We can then use index terms of the sort stp to represent the types in a simply typed λ-calculus where tuples are supported and there are also base types for booleans and integers.

	In Section 7.3, we will present a concrete programming example involving the type index language Lalg .

- 3.3.2 Another type index language Lint

	We now formally describe another type index language Lint in which we can form integer expressions.

	The syntax for Lint is given as follows:
	
		index sorts s ::= bool | int
		index terms I ::= a | C(I1, . . . , In)
	
	There are no tuples and functions (formed through λ-abstraction) in Lint, and the constants C in Lint together with their c-sorts are listed in Figure 10.

	Let Dint be the domain (set) of integers and Mint be h{Dbool , Dint}, Iinti, where Iint maps each constant in Lint to its standard interpretation.

	For instance, I(+) and I(−) are the standard addition and subtraction functions on integers, respectively.

	It can be readily verified that Mint is a model for Lint. Therefore, the constraint relation |=Mint is regular.

		true : () → bool
		false : () → bool
		i : () → int for every integer i
		¬ : (bool) → bool negation
		∧ : (bool, bool) → bool conjunction
		∨ : (bool, bool) → bool disjunction
		+ : (int, int) → int
		− : (int, int) → int
		: (int, int) → int
		/ : (int, int) → int
		max : (int, int) → int
		min : (int, int) → int
		mod : (int, int) → int modulo operation
		≥ : (int, int) → bool
		> : (int, int) → bool
		≤ : (int, int) → bool
		< : (int, int) → bool
		= : (int, int) → bool
		6= : (int, int) → bool
		. . . : . . .

	- Fig. 10. The constants and their c-sorts in Lint

		datasort typ = Arrow of (typ, typ) | All of (typ -> typ)
		datatype EXP (typ) =
		| {a1:typ, a2:typ} EXPlam (Arrow (a1, a2)) of (EXP (a1) -> EXP (a2))
		| {a1:typ, a2:typ} EXPapp (a2) of (EXP (Arrow (a1, a2)), EXP (a1))
		| {f:typ -> typ} EXPalli (All (f)) of ({a:typ} EXP (f a))
		| {f:typ -> typ,a:typ} EXPalle (f a) of (EXP (All f))

	- Fig. 11. An example involving higher-order type index terms

	Given a constraint φ; P~ |=Mint P0, where φ = a1 : int, . . . , an : int, and each P in P~ is a linear inequality on integers, and P0 is also a linear inequality on integers, we can use linear integer programming to solve such a constraint.

	制約φを考える。 P〜|=ミントP0、どこに、φ=のA1：int型、。 。 。 、：int型、およびP〜の各Pは整数に対する線形不等式であり、P0は、我々はそのような制約を解決するために、線形整数計画を使用することができ、また、整数上の線形不等式です。

	We will mention later that we can make use of the type index language Lint in the design of a dependently type functional programming language where type equality between two types can be decided through linear integer programming.

	我々はの設計タイプインデックス言語リントを利用することができ、後に言及します依存して二種類のタイプの平等は線形整数計画を経て決定することができる機能的なプログラミング言語を入力します。

	Though the problem of linear integer programming itself is NP-complete, we have observed that the overwhelming majority of constraints encountered in practice can be solved in a manner that is efficient enough to support realistic programming.

	線形整数計画自体の問題は、NP完全であるが、我々は、実際に遭遇する制約の圧倒的多数は、現実的なプログラミングをサポートするのに十分に効率的な方法で解決することができることを観察した。

- 3.3.3 Higher-order type index terms

	There are no higher-order type indexes, that is, type index terms of function sorts, in either Lalg or Lint.

	高次タイプのインデックスはLalgや糸くずのどちらかの関数の種類、のタイプインデックスの用語は、つまり、全くありません。

	In general, the constraint relation involving higher-order type indexes are often difficult or simply intractable to solve.

	一般に、高次型索引付けに関連する制約関係は、しばしば困難または解決することが簡単に難治性である。

	We now present a type index language Lλ, which extends Lalg with higher-order type indexes as follows:

	我々は現在、次のように高次タイプのインデックスとLalgを拡張タイプインデックス言語Lλを提示：

		index terms I ::= . . . | λa : s.I | I1(I2)

	Like in Lalg , a constraint in Lλ is of the following form:

	Lalgのように、Lλで制約は以下の形式は次のとおりです。

		a1 : b1, . . . , an : bn; I1 .= I 0 1 , . . . , In .= I 0 n |= I .= I 0

	For instance, we may ask whether the following constraint holds:

	たとえば、我々は以下の制約が成立するかどうか尋ねる場合があります:

		a1 : b → b, a2 : b; a1(a1(a2)) .= a1(a2) |= a1(a2) = a2

	If there are two distinct constants C1 and C2 of sort b, then the answer is negative since a counterexample can be constructed by letting a1 and a2 be λa : b.C1 and C2, respectively.

	それぞれ、b.C1及びC2：つの異なる定数C1とソートbのC2がある場合反例をa1とa2をλaとすることがせることによって構築することができるので、答えは否定的である。

	Clearly, the problem of solving constraints in Lλ is undecidable as (a special case of) it can be reduced to the problem of higher-order unification.


	（特別な場合）には高次の統一の問題に還元することができるように明確に、Lλに制約を解決する問題が決定不能である。

	For instance, φ; I1 .= I2 |= false holds if and only if there exists no substitution Θ : φ such that I1[Θ] and I2[Θ] are βη-equivalent.

	例えば、φ。 I1= I2|=全く代替Θが存在しないとする場合にのみ場合はfalseが成り立つ：。そのようなφI1[Θ]とI2[Θ]はβη等価であること。

	----

	In practice, we can decide to only handle constraints of the following simplified form:

	実際には、我々は唯一以下の簡略化した形の制約を処理するために決定することができます。

		φ; a1.= I1, . . . , an.= In |= I.= I0

	where for 1 ≤ i ≤ j ≤ n, there are no free occurrences of aj in Ii.

	1≤のために、私はJの≤nを≤場所、井伊でAJの空き出現はありません。


	Solving such a constraint can essentially be reduced to deciding the βη-equality on two simply typed λ-terms, which is done by comparing whether the two λ-terms have the same long βη-normal form.

	解決そのような制約は、基本的に2つのλ-用語が同じ長いβη-正規形を持っているかどうかを比較することによって行われている2単に入力されたλ-条件でβη-平等を、決定に還元することができる。

	----

	We now present an example that makes use of higher-order type indexes.

	我々は現在、高次タイプのインデックスを利用した例を提示する。

	The constraints on type indexes involved in this example have the above simplified form and thus can be easily solved using βη-normalization.

	この例では、関連するタイプのインデックスに対する制約は、上記の簡略化した形態を有し、したがって、容易にβη正規化を使用して解くことができる。

	The concrete syntax in Figure 11 declares a sort typ and a type constructor EXP that takes an index term I of sort typ to form a type EXP(I).

	図11の具体的な構文は、ソートTYPとタイプEXP（I）を形成するために、一種の標準索引用語Iをとり型コンストラクタのEXPを宣言します。

	The value constructors associated with EXP are assigned the following c-types:

	EXPに関連付けられた値コンストラクタは、次のC-タイプが割り当てられています。

		EXPlam : Πa1 :typ.Πa2 :typ.
			(EXP(a1) → EXP(a2)) ⇒ EXP(Arrow(a1, a2))
		EXPapp : Πa1 :typ.Πa2 :typ.
			(EXP(Arrow(a1, a2)), EXP(a1)) ⇒ EXP(a2)
		EXPalli : Πf :typ → typ.
			(Πa:typ. EXP(f(a))) ⇒ EXP(All(f))
		EXPalle : Πf :typ → typ.Πa:typ.
			(EXP(All(f))) ⇒ EXP(f(a))

	The intent is to use an index term I of sort typ to represent a type in the secondorder polymorphic λ-calculus λ2 (a.k.a. system F), and a value of type EXP(I) to represent a λ-term in λ2 that can be assigned the type represented by I.

	意図ができλ2におけるλ期を表現するためにsecondorder多型λ計算のλ2（別名システムF）を入力し、タイプEXP（I）の値を表すために、一種の標準索引用語Iを使用することですIで表さタイプが割り当て

	For instance, the type ∀α. α → α is represented as All(λa : typ. Arrow(a, a)), and the following term:

	例えば、タイプの∀α。 α→αはすべてのように表される（λaは：。TYP矢印（、a）参照）、および以下の言葉を。

		EXPalli(Π+(EXPalli(Π+(EXPlam(lamx. EXPlam(lamy. EXPapp(y, x)))))))

	----


		types τ ::= . . . | δ(
		~I) | P ⊃ τ | P ∧ τ | Πa:s. τ | Σa:s. τ
		expressions e ::= . . . | ⊃
		+(v) | ⊃
		−(e) | Π
		+(v) | Π
		−(e) |
		∧(e) | let ∧ (x) = e1 in e2 end |
		Σ(e) | let Σ(x) = e1 in e2 end
		values v ::= . . . | ⊃
		+(v) | Π
		+(v) | ∧(v) | Σ(v)

		Fig. 12. The syntax for λ Π,Σ pat

	which can be given the following type:

	これは、次の型を与えることができる：

		EXP(All(λa1 : typ. All(λa2 : typ. Arrow(a1, Arrow(Arrow(a1, a2), a2)))))

	represents the λ-term Λα1.Λα2.λx : α1.λy : α1 → α2.y(x).

	λ長期Λα1.Λα2.λxが表す：α1.λy：α1は→α2.y（X）。

	This is a form of higherorder abstract syntax (h.o.a.s.) representation for λ-terms (Church, 1940; Pfenning & Elliott, 1988; Pfenning, n.d.).

	これはλ-用語（;プフェニング＆エリオット、1988;プフェニング、ND教会、1940）のためのhigherorder抽象構文（のHoA）表現の一形態である。

	As there is some unfamiliar syntax involved in this example, we suggest that the reader revisit it after studying Section 4.

	この例に関わるいくつかのなじみのない構文があるように、我々は読者が第4節を勉強した後にそれを再検討することを示唆している。

- 4 λ Π,Σ pat : Extending λpat with dependent types

	In this section, we introduce both universal and existential dependent types into the type system of λpat, leading to the design of a programming language schema λΠ,Σ pat (L) that parameterizes over a given type index language L.

	このセクションでは、与えられたタイプのインデックス言語L.上のパラメータ化プログラミング言語スキーマλΠ、Σパット（L）の設計につながる、λpatの型システムに両方のユニバーサルとexistential(実存)依存型を導入

- 4.1 Syntax

	Let us fix a type index language L.

	我々はタイプインデックス言語Lを修正しましょう

	We now present λΠ,Σ pat = λΠ,Σ pat (L), which is an extension of λpat with universal and existential dependent types.

	我々はここで、本λΠ、universal(普遍的)でexistential(実存)的依存型とλpatの拡張であるΣパット=λΠ、Σパット（L）、。

	The syntax of λΠ,Σ pat is given in Figure 12, which extends the syntax in Figure 3.

	λΠ、Σパットの構文は、図3の構文を拡張し、図12に与えられている。

	For instance, we use . . . in the definition of types in λΠ,Σ pat for the following definition of types in λpat:


	たとえば、使用しております。 。 。 λΠ、λpat内の型の次の定義のためのΣパット内の型の定義で：

		1 | τ1 ∗ τ2 | τ1 → τ2
	
	We now use δ for base type families. We may write δ for δ(), which is just an unindexed type.

	我々は現在、基本型家族のためにδを使用しています。私達はちょうどインデックスのないタイプであるδのためのδ（）を、書き込むことができる。

	We do not specify here as to how new type families can actually be declared.

	我々は、新しいタイプの家族が実際に宣言することができますどのように、ここで指定しないでください。

	In our implementation, we do provide a means for the programmer to declare type families.

	我々の実装では、プログラマがタイプファミリを宣言するための手段を提供します。

	For instance, in Section 1, there is such a declaration in the example presented in Figure 1.

	例えば、第1節では、図1に示す例では、そのような宣言があります。

	----

	We use the names universal (dependent) types, existential (dependent) types, guarded types and asserting types for types of the forms Πa:s. τ , Σa:s. τ , P ⊃ τ and P ∧ τ , respectively.

	我々は、フォームπAの種類の名前のユニバーサル（依存）の種類、existential(実存)（依存）のタイプ、保護されたタイプと主張するタイプを使用します。■。 τ、ΣA：S。それぞれτ、P⊃τとP∧τ、。

	Note that the type constructor ∧ is asymmetric.

	型コンストラクタは∧非対称であることに注意してください。

	In addition, we use the names universal expressions, existential expressions, guarded expressions and asserting expressions for expressions of the forms Π+(v), Σ(e), ⊃+(v) and ∧(e), respectively.

	また、我々は形の表現のために名前をuniversal(普遍的)な表現、existential(実存)的表現、保護された式と主張する表現を使用Π+（V）、Σ（E）、⊃+（V）と∧（e）は、それぞれ。

	----

	In the following presentation, we may write ~I for a (possibly empty) sequence of index terms I1, . . . , In; P~ for a (possibly empty) sequence of index propositions P1, . . . , Pn; Πφ for a (possibly empty) sequence of quantifiers:

	以下の発表では、書くことが〜私、索引語I1の（空）の配列について。 。 。 、では、用のP〜インデックス命題P1の（空）のシーケンス、。 。 。 、Pnは、数量詞の（空）の配列についてΠφ：

		Πa1 : s1 . . . Πan : sn, ` δ(s1, . . . , sn) φ ` Ik : sk for 1 ≤ k ≤ n
		φ ` δ(I1, . . . , In) [type]
		(tp-base)
		φ ` 1 [type]
		(tp-unit)
		φ ` τ1 [type] φ ` τ2 [type]
		φ ` τ1 ∗ τ2 [type]
		(tp-prod)
		φ ` τ1 [type] φ ` τ2 [type]
		φ ` τ1 → τ2 [type]
		(tp-fun)
		φ ` P : bool φ ` τ [type]
		φ ` P ⊃ τ [type]
		(tp-⊃)
		φ, a : s ` τ [type]
		φ ` Πa:s. τ [type]
		(tp-Π)
		φ ` P : bool φ ` τ [type]
		φ ` P ∧ τ [type]
		(tp-∧)
		φ, a : s ` τ [type]
		φ ` Σa:s. τ [type]
		(tp-Σ)
		φ ` ∅ [ctx]
		(ctx-emp)
		φ ` Γ [ctx] φ ` τ [type] xf 6∈ dom(Γ)
		φ ` Γ, xf : τ [ctx]
		(ctx-ext)

		Fig. 13. The type and context formation rules in λΠ,Σ pat

	where the index context φ is a1 : s1, . . . , an : sn; P~ ⊃ τ for P1 ⊃ (. . .(Pn ⊃ τ ). . .) if P~ = P1, . . . , Pn.

	----

	Notice that a form of value restriction is imposed in λΠ,Σ pat : It is required that e be a value in order to form expressions Π+(e) and ⊃ +(e).

	This form of value restriction can in general greatly simplify the treatment of effectful features such as references (Wright, 1995), which are to be added into λΠ,Σ pat in Section 6.

	We actually need to slightly relax this form of value restriction in Section 6.3 by only requiring that e be a value-equivalent expression (instead of a value) when Π+(e) or ⊃+(e) is formed.

	Generally speaking, a value-equivalent expression, which is to be formally defined later, refers to an expression that is operationally equivalent to a value.

	----

	Intuitively, in order to turn a value of a guarded type P ⊃ τ into a value of type τ , we must establish the proposition P; if a value of an asserting type P ∧ τ is generated, then we can assume that the proposition P holds.

	For instance, the following type can be assigned to the usual division function on integers,

		Πa1 :int.Πa2 :int. (a2 6= 0) ⊃ (int(a1) ∗ int(a2) → int(a1/a2))

	where / stands for the integer division function in some type index language. The

		φ; P~ |= I1
		.
		= I
		0
		1 · · · φ; P~ |= In
		.
		= I
		0
		n
		φ;P~ |= δ(I1, . . . , In) ≤
		s
		tp δ(I
		0
		1, . . . , I
		0
		n)
		(st-sub-base)
		φ; P~ |= 1 ≤
		s
		tp 1
		(st-sub-unit)
		φ;P~ |= τ1 ≤
		s
		tp τ
		0
		1 φ; P~ |= τ2 ≤
		s
		tp τ
		0
		2
		φ; P~ |= τ1 ∗ τ2 ≤
		s
		tp τ
		0
		1 ∗ τ
		0
		2
		(st-sub-prod)
		φ;P~ |= τ
		0
		1 ≤
		s
		tp τ1 φ; P~ |= τ2 ≤
		s
		tp τ
		0
		2
		φ; P~ |= τ1 → τ2 ≤
		s
		tp τ
		0
		1 → τ
		0
		2
		(st-sub-fun)
		φ; P~ , P
		0
		|= P φ; P~ , P
		0
		|= τ ≤
		s
		tp τ
		0
		φ; P~ |= P ⊃ τ ≤
		s
		tp P
		0 ⊃ τ
		0
		(st-sub-⊃)
		φ, a : s; P~ |= τ ≤
		s
		tp τ
		0
		φ; P~ |= Πa:s. τ ≤
		s
		tp Πa:s. τ
		0
		(st-sub-Π)
		φ; P~ , P |= P
		0 φ; P~ , P |= τ ≤
		s
		tp τ
		0
		φ; P~ |= P ∧ τ ≤
		s
		tp P
		0 ∧ τ
		0
		(st-sub-∧)
		φ, a : s; P~ |= τ ≤
		s
		tp τ
		0
		φ; P~ |= Σa:s. τ ≤
		s
		tp Σa:s. τ
		0
		(st-sub-Σ)

	- Fig. 14. The static subtype rules in λ Π,Σ pat

		x ↓ τ ⇒ (∅; ∅; x : τ )
		(pat-var)
		hi ↓ 1 ⇒ (∅; ∅; ∅)
		(pat-unit)
		p1 ↓ τ1 ⇒ (φ1; P~1; Γ1) p2 ↓ τ2 ⇒ (φ2; P~2; Γ2)
		hp1, p2i ↓ τ1 ∗ τ2 ⇒ (φ1, φ2; P~1, P~2; Γ1, Γ2)
		(pat-prod)
		φ0; P~0 ` cc(τ ) : δ(I1, . . . , In) p ↓ τ ⇒ (φ; P~ ; Γ)
		cc(p) ↓ δ(I
		0
		1, . . . , I
		0
		n) ⇒ (φ0, φ; P~0, P~ , I1
		.= I
		0
		1, . . . , In
		.= I
		0
		n; Γ)
		(pat-const)

	- Fig. 15. The typing rules for patterns

	following type is a rather interesting one:

		Πa:bool. bool(a) → (a.= true) ∧ 1

	This type can be assigned to a function that checks at run-time whether a boolean expression holds.

	In the case where the boolean expression fails to hold, some form of exception is to be raised.

	Therefore, this function acts as a verifier for run-time assertions made in programs.

	----

	In practice, we also have a notion of subset sort.

	We use sˆ to range over subset

		φ; P~ ; Γ ` e : τ1 φ;P~ |= τ1 ≤
		s
		tp τ2
		φ;P~ ; Γ ` e : τ2
		(ty-sub)
		φ ` Γ [ctx] Γ(xf ) = τ
		φ; P~ ; Γ ` xf : τ
		(ty-var)
		φ0; P~0 ` c(τ ) : δ(
		~I0) φ ` Θ : φ0 φ; P~ |= P~0[Θ] φ; P~ ; Γ ` e : τ [Θ]
		φ; P~ ; Γ ` c(e) : δ(
		~I0[Θ])
		(ty-const)
		φ ` Γ [ctx]
		φ; P~ ; Γ ` hi : 1
		(ty-unit) φ; P~ ; Γ ` e1 : τ1 φ;P~ ; Γ ` e2 : τ2
		φ; P~ ; Γ ` he1, e2i : τ1 ∗ τ2
		(ty-prod)
		φ; P~ ; Γ ` e : τ1 ∗ τ2
		φ; P~ ; Γ ` fst(e) : τ1
		(ty-fst) φ; P~ ; Γ ` e : τ1 ∗ τ2
		φ; P~ ; Γ ` snd(e) : τ2
		(ty-snd)
		p ↓ τ1 ⇒ (φ0; P~0, Γ0) φ, φ0; P~ ; P~0; Γ, Γ0 ` e : τ2
		φ;P~ ; Γ ` p ⇒ e : τ1 → τ2
		(ty-clause)
		φ; P~ ; Γ ` pk ⇒ ek : τ1 → τ2 for k = 1, . . . , n
		φ; P~ ; Γ ` (p1 ⇒ e1 | · · · | pn ⇒ en) : τ1 → τ2
		(ty-clause-seq)
		φ; P~ ; Γ ` e : τ1 φ;P~ ; Γ ` ms : τ1 → τ2
		φ; P~ ; Γ ` case e of ms : τ2
		(ty-case)
		φ;P~ ; Γ, x : τ1 ` e : τ2
		φ; P~ ; Γ ` lamx. e : τ1 → τ2
		(ty-lam)
		φ; P~ ; Γ ` e1 : τ1 → τ2 φ;P~ ; Γ ` e2 : τ1
		φ; P~ ; Γ ` e1(e2) : τ2
		(ty-app)
		φ; P~ ; Γ, f : τ ` e : τ
		φ; P~ ; Γ ` fix f. e : τ
		(ty-fix)
		φ; P~ ; Γ ` e1 : τ1 φ; P~ ; Γ, x : τ1 ` e2 : τ2
		φ; P~ ; Γ ` let x = e1 in e2 end : τ2
		(ty-let)

		Fig. 16. The typing rules for λΠ,Σ pat (1)

	sorts, which are formally defined as follows:

		subset sort sˆ ::= s | {a : sˆ | P}

	where the index variable a in {a : sˆ | P} binds the free occurrences of a in P.
	
	Note that subset sorts, which extend sorts, are just a form of syntactic sugar.

	Intuitively, the subset sort {a : sˆ | P} is for index terms I of subset sort sˆ that satisfy the proposition P[a 7→ I]. For instance, the subset sort nat is defined to be {a : int | a ≥ 0}.

	In general, we may write {a : s | P1, . . . , Pn} for the subset sort sˆn defined as follows:

		sˆ0 = s sˆk = {a : sˆk−1 | Pk}
		φ; P~ , P; Γ ` v : τ
		φ; P~ ; Γ `⊃+(v) : P ⊃ τ
		(ty-⊃-intro)
		φ; P~ ; Γ ` e : P ⊃ τ φ; P~ |= P
		φ; P~ ; Γ `⊃−(e) : τ
		(ty-⊃-elim)
		φ, a : s;P~ ; Γ ` v : τ
		φ; P~ ; Γ ` Π
		+(v) : Πa:s. τ
		(ty-Π-intro)
		φ; P~ ; Γ ` e : Πa:s. τ φ ` I : s
		φ; P~ ; Γ ` Π
		−(e) : τ [a 7→ I]
		(ty-Π-elim)
		φ; P~ ; Γ ` e : τ φ; P~ |= P
		φ; P~ ; Γ ` ∧(e) : P ∧ τ
		(ty-∧-intro)
		φ; P~ ; Γ ` e1 : P ∧ τ1 φ; P~ , P; Γ, x : τ1 ` e2 : τ2
		φ;P~ ; Γ ` let ∧ (x) = e1 in e2 end : τ2
		(ty-∧-elim)
		φ; P~ ; Γ ` e : τ [a 7→ I] φ ` I : s
		φ; P~ ; Γ ` Σ(e) : Σa:s. τ
		(ty-Σ-intro)
		φ; P~ ; Γ ` e1 : Σa:s. τ1 φ, a : s; P~ ; Γ, x : τ1 ` e2 : τ2
		φ; P~ ; Γ ` let Σ(x) = e1 in e2 end : τ2
		(ty-Σ-elim)

		Fig. 17. The typing rules for λΠ,Σ pat (2)

	where k = 1, . . . , n.

	----

	We use φ; P~ ` I : {a : s | P1, . . . , Pn} to mean that φ; P~ ` I : s is derivable and φ; P~ ` Pi [a 7→ I] hold for i = 1, . . . , n.

	Given a subset sort sˆ, we write Πa:sˆ. τ for Πa:s. τ if sˆ is s, or for Πa:sˆ1. P ⊃ τ if sˆ is {a : sˆ1 | P}. Similarly, we write Σa:s. ˆ τ
	for Σa:s. τ if sˆ is s, or for Σa:sˆ1. P ∧ τ if sˆ is {a : sˆ1 | P}. For instance, we write Πa1 :nat. int(a1) → Σa2 :nat. int(a2) for the following type:

		Πa1 :int .(a1 ≥ 0) ⊃ (int(a1) → Σa2 :int .(a2 ≥ 0) ∧ int(a2)),

	which is for functions that map natural numbers to natural numbers.

- 4.2 Static semantics

	We start with the rules for forming types and contexts, which are listed in Figure 13.

	We use the syntax ` δ(s1, . . . , sn) to indicate that we can construct a type δ(I1, . . . , In) when given type index terms I1, . . . , In of sorts s1, . . . , sn, respectively.

	----

	A judgment of the form φ ` τ [type] means that τ is a well-formed type under the index context φ, and a judgment of the form φ ` Γ [ctx] means that Γ is a well-formed (expression) context under φ.

	The domain dom(Γ) of a context Γ is defined to be the set of variables declared in Γ.

	We write φ; P~ |= P0 for a regular constraint relation in the fixed type index language L.

	----

	In λΠ,Σ pat , type equality, that is, equality between types, is defined in terms of the static subtype relation ≤s tp:

	We say that τ and τ0 are equal if both τ ≤s tp τ0 and τ0 ≤s tp τ hold.

	By overloading |=, we use φ; P~ |= τ ≤s tp τ0 for a static subtype judgment and present the rules for deriving such a judgment in Figure 14.

	Note that all of these rules are syntax-directed.
	
	----

	The static subtype relation ≤s tp is often too weak in practice.

	For instance, we may need to use a function of the type τ1 = Πa:int. int(a) → int(a) as a function of the type τ2 = (Σa :int. int(a)) → (Σa :int. int(a)), but it is clear that τ1 ≤s tp τ2 does not hold (as ≤s tp is syntax-directed).

	We are to introduce in Section 4.6 another subtype relation ≤d tp, which is much stronger than ≤s tp and is given the name dynamic subtype relation.

	----

	The following lemma, which is parallel to Lemma 3.1, essentially states that the rules in Figure 14 are closed under substitution.

	- Lemma 4.1

		1. If φ, φ0; P~ |= τ ≤s
			tp τ
			0
			is derivable and φ ` Θ : φ0 holds, then φ; P~ [Θ] |=
			τ [Θ] ≤s
			tp τ
			0
			[Θ] is also derivable.

		2. If φ; P~ , P~
			0 |= τ ≤s
			tp τ
			0
			is derivable and φ; P~ |= P~
			0 holds, then φ; P~ |= τ ≤s
			tp τ
			0
			is also derivable.

	- Proof

		(Sketch) (1) and (2) are proven by structural induction on the derivations of

			φ, φ0; P~ |= τ ≤s
			tp τ
			0 and φ; P~ , P~
			0 |= τ ≤s
			tp τ
			0

		, respectively.
		Lemma 3.1 is needed in the proof. □
	
	As can be expected, the static subtype relation is both reflexive and transitive.

	- Proposition 4.2 (Reflexitivity and Transitivity of ≤s tp)

		1. φ; P~ |= τ ≤s
			tp τ holds for each τ such that φ ` τ [type] is derivable.
		2. φ; P~ |= τ1 ≤s
			tp τ3 holds if φ; P~ |= τ1 ≤s
			tp τ2 and φ; P~ |= τ2 ≤s
			tp τ3 do.
	- Proof

		Straightforward. □

	We now present the typing rules for patterns in Figure 15 and then the typing rules for expressions in Figure 16 and Figure 17.

	----

	The typing judgments for patterns are of the form p ↓ τ ⇒ (φ; P~; Γ), and the rules for deriving such judgments are given in Figure 15.

	A judgment of the form p ↓ τ ⇒ (φ; P~ ; Γ) means that for any value v of the type τ , if v matches p, that is, match(v, p) ⇒ θ holds for some substitution θ, then there exists an index substitution Θ such that ∅ ` Θ : φ, ∅; ∅ |= P~ [Θ] and (∅; ∅; ∅) ` θ : Γ[Θ].

	This is captured precisely by Lemma 4.10. In the rule (pat-prod), it is required that φ1 and φ2 share no common index variables in their domains.

	In the rule (pat-const), we write φ0; P~0 ` cc(τ ) : δ(I1, . . . , In) to mean that cc is a constant constructor assigned (according to some signature for constants) the following c-type:

		Πφ0.P~
		0 ⊃ (τ ⇒ δ(I1, . . . , In))

	In other words, given a constant constructor cc, we can form a rule (pat-const) for this particular cc based on the c-type assigned to cc.

	----

	The typing rules given in Figure 16 are mostly expected.

	The rule (ty-clause) requires that τ2 contain only type index variables declared in φ.

	For universal dependent types, existential dependent types, guarded types, and assertion types, the typing rules are given in Figure 17.

	Note that we have omitted certain obvious side conditions that need to be attached to some of these rules.

	For instance, in the rule (ty-Π-intro), the type index variable a is assumed to have no free occurrences in either P~ or Γ.

	Also, in the rule (ty-Σ-elim), the type index variable a is assumed to have no free occurrences in either P~, Γ or τ2.

	We now briefly go over some of the typing rules in Figure 17.

	- If a value v can be assigned a type τ under an assumption P, then the typing rule (ty-⊃-intro) assigns ⊃+(v) the guarded type P ⊃ τ .
		Notice the presence of value restriction here.
	- Given an expression e of type P ⊃ τ , the typing rule (ty-⊃-elim) states that the expression ⊃−(e) can be formed if the proposition P holds.
		Intuitively, a guarded expression is useful only if the guard can be discharged.
	- If e can be assigned a type τ and P holds, then the typing rule (ty-∧-intro) assigns ∧(e) the asserting type P ∧ τ .

	- The elimination rule for the type constructor ∧ is (ty-∧-elim).
		Assume that e2 can be assigned a type τ2 under the assumption that P holds and x is of type τ1.
	- If e1 is given the asserting type P ∧ τ1, then the rule (ty-∧-elim) assigns the type τ2 to the expression let ∧ (x) = e1 in e2 end.
		Clearly, this rule resembles the treatment of existentially quantified packages (Mitchell & Plotkin, 1988).

	The following lemma is parallel to Lemma 2.1. We need to make use of the assumption that the constraint relation involved here is regular when proving the first two statements in this lemma.

	- Lemma 4.3 (Thinning)

		Assume D :: φ; P~ ; Γ ` e : τ .

		1. For every index variable a that is not declared in φ, we have a derivation D0 :: φ, a : s; P~ ; Γ ` e : τ such that height(D) = height(D0).
		2. For every P such that φ ` P : bool is derivable, we have a derivation D0 :: φ; P~, P; Γ ` e : τ such that height(D) = height(D0).
		3. For every variable xf that is not declared in Γ and τ0 such that φ ` τ0[type] is derivable, we have a derivation D0:: φ; P~ ; Γ, xf : τ0 ` e : τ such that height(D) = height(D0).

	- Proof

		Straightforward. □

	The following lemma indicates a close relation between the type of a closed value in λΠ,Σ pat and the form of the value, which is needed in the proof of Theorem 4.12, the Progress Theorem for λΠ,Σ pat .

	- Lemma 4.4 (Canonical Forms)

		Assume that ∅; ∅; ∅ ` v : τ is derivable.

		1. If τ = δ(~I) for some type family δ, then v is of the form cc(v0), where cc is a constant constructor assigned a c-type of the form Πφ.P~ ⊃ (τ0 ⇒ δ(~I0)).
		2. If τ = 1, then v is hi.
		3. If τ = τ1 ∗ τ2, then v is of the form hv1, v2i.
		4. If τ = τ1 → τ2, then v is of the form lamx. e.
		5. If τ = P ⊃ τ0, then v is of the form ⊃+(v0).
		6. If τ = Πa:s. τ0, then v is of the form Π+(v0).
		7. If τ = P ∧ τ0, then v is of the form ∧(v0).
		8. If τ = Σa:s. τ0, then v is of the form Σ(v0).

	- Proof

		By a thorough inspection of the typing rules in Figure 16 and Figure 17. □

	Clearly, the following rule is admissible in λΠ,Σ pat as it is equivalent to the rule (ty-var) followed by the rule (ty-sub):

		φ ` Γ [ctx] Γ(xf) = τ φ; P~ |= τ ≤s
		tp τ
		0
		φ; P~ ; Γ ` xf : τ
		0
		(ty-var’)

	In the following presentation, we retire the rule (ty-var) and simply replace it with the rule (ty-var’).

	The following technical lemma is needed for establishing Lemma 4.6.

	- Lemma 4.5

			Assume D :: φ; P~; Γ, xf : τ1 ` e : τ2. If φ; P~ |= τ
			0
			1 ≤s
			tp τ1, then there exists D0
			::
			φ; P~ ; Γ, xf : τ
			0
			1 ` e : τ2 such that height(D) = height(D0
			).

	- Proof

		(Sketch) By structural induction on the derivation D.

		We need to make use of the fact that the rule (ty-var) is replaced with the rule (ty-var’) in order to show height(D) = height(D0). □

	The following lemma is needed in the proof of Theorem 4.11, the Subject Reduction Theorem for λΠ,Σ pat .

	- Lemma 4.6

		Assume D :: φ; P~; Γ ` v : τ . Then there exists a derivation D0 :: φ; P~ ; Γ ` v : τ such that height(D0) ≤ height(D) and the last typing rule applied in D0 is not (ty-sub).

	- Proof

		(Sketch) The proof proceeds by structural induction on D.

		When handling the case where the last applied rule in D is (ty-lam), we make use of Lemma 4.5 and thus see the need for replacing (ty-var) with (ty-var’). □

	Note that the value v in Lemma 4.6 cannot be replaced with an arbitrary expression.

	For instance, if we replace v with an expression of the form Π−(e), then the lemma cannot be proven.

	----

	The following lemma plays a key role in the proof of Theorem 4.11, the Subject Reduction Theorem for λΠ,Σ pat .

	- Lemma 4.7 (Substitution)

		1. Assume that φ, φ0; P~ ; Γ ` e : τ is derivable. If φ ` Θ : φ0 holds, then φ; P~[Θ]; Γ[Θ] ` e : τ [Θ] is also derivable.
		2. Assume that φ; P~ , P~0; Γ ` e : τ is derivable. If φ; P~ |= P~0 holds, then φ; P~ ; Γ `e : τ is also derivable.
		3. Assume that φ; P~ ; Γ, Γ0 ` e : τ is derivable. If φ; P~; Γ ` θ : Γ0 holds, then φ; P~; Γ ` e[θ] : τ is also derivable.

	- Proof

		(Sketch) All (1), (2) and (3) are proven straightforwardly by structural induction on the derivations of the typing judgments φ, φ0; P~ ; Γ ` e : τ , and φ; P~ , P~0; Γ ` e : τ , and φ; P~; Γ, Γ0 ` e : τ , respectively. □

- 4.3 Dynamic semantics

	We now need to extend the definition of evaluation contexts (Definition 2.4) as follows.

	- Definition 4.8 (Evaluation Contexts)

			evaluation contexts E ::= . . . | ⊃+(E) | ⊃−(E) | Π+(E) | Π−(E) |
			∧(E) | let ∧(x) = E in e end |
			Σ(E) | let Σ(x) = E in e end

		We are also in need of extending the definition of redexes and their reducts (Defi-nition 2.5).

	- Definition 4.9

		In addition to the forms of redexes in Definition 2.5, we have the following new forms of redexes:

		- ⊃−(⊃+(v)) is a redex, and its reduct is v.
		- Π−(Π+(v)) is a redex, and its reduct is v.
		- let ∧(x) = ∧(v) in e end is a redex, and its reduct is e[x 7→ v].
		- let Σ(x) = Σ(v) in e end is a redex, and its reduct is e[x 7→ v].

	Note that Definition 2.7, where V-form, R-form, M-form, U-form and E-form are defined, can be readily carried over from λpat into λΠ,Σ pat .

	----

	The following lemma captures the meaning of the typing judgments for patterns; such judgments can be derived according to the rules in Figure 15.

	- Lemma 4.10

		Assume that ∅; ∅; ∅ ` v : τ is derivable.
		If p ↓ τ ⇒ (φ; P~ ; Γ) and match(v, p) ⇒ θ are also derivable, then there exists Θ satisfying ∅ ` Θ : φ such that both ∅; ∅ |= P~ [Θ] and (∅; ∅; ∅) ` θ : Γ[Θ] hold.

	- Proof

		(Sketch) By structural induction on the derivation of p ↓ τ ⇒ (φ; P~ ; Γ). □

	----

		fun zip (nil, nil) = nil
		| zip (cons (x, xs), cons (y, ys)) = (x, y) :: zip (xs, ys)

	Fig. 18. An example of exhaustive pattern matching

- 4.4 Type soundness

	In order to establish the type soundness for λΠ,Σ pat , we make the following assumption:

	For each constant function cf assigned c-type Πφ.P~ ⊃ (τ ⇒ δ(~I)), if ∅; ∅ |= P~ [Θ] holds for some substitution Θ satisfying ∅ ` Θ : φ and ∅; ∅; ∅ ` v : τ [Θ] is derivable and cf(v) is defined to be v0, then ∅; ∅; ∅ ` v0 : δ(~I[Θ]) is also derivable.

	In other words, we assume that each constant function meets its specification. That is, each constant function respects its c-type assignment.

	- Theorem 4.11 (Subject Reduction)

		Assume ∅; ∅; ∅ ` e1 : τ and e1 ,→ev e2. Then ∅; ∅; ∅ ` e2 : τ is also derivable.

	- Proof

		A completed proof of this theorem is given in Appendix B. □

	- Theorem 4.12 (Progress)

		Assume that ∅; ∅; ∅ ` e1 : τ is derivable. Then there are only four possibilities:

		- e1 is a value, or
		- e1 is in M-form, or
		- e1 is in U-form, or
		- e1 ,→ev e2 holds for some expression e2.

		In particular, this implies that e1 cannot be in E-form.

	- Proof

		(Sketch) The proof immediately follows from structural induction on the derivation of ∅; ∅; ∅ ` e1 : τ .

		Lemma 4.4 plays a key role in this proof. □

	By Theorem 4.11 and Theorem 4.12, we can readily claim that for a well-typed closed expression e in λΠ,Σ pat , either e evaluates to a value, or e evaluates to an expression in M-form, or e evaluates to an expression in U-form, or e evaluates forever.

	----

	When compared to λpat, it is interesting to see what progress we have made in λΠ,Σ pat .

	We may now assign a more accurate type to a constant functions cf to eliminate the occurrences of undefined cf(v) for certain values v.

	For instance, if the division function on integers is assigned the following c-type:

		Πa1 :int.Πa2 :int. (a2 6= 0) ⊃ (int(a1) ∗ int(a2) ⇒ int(a1/a2))

	then division by zero causes to a type error and thus can never occur at run-time.

	Similarly, we may now assign a more accurate type to a function to eliminate some occurrences of expressions of the form case v of ms that are not ev-redexes.

	For instance, when applied to two lists of unequal length, the function zip in Figure 18 evaluates to some expression of the form E[case v of ms] where case v of ms is not an ev-redex.

	If we annotate the definition of zip with the following type annotation, withtype {n:nat} ’a list (n) * ’b list (n) -> (’a * ’b) list (n) that is, we assign zip the following type (which requires the feature of parametric polymorphism that we are to introduce in Section 6):

		∀α1.∀α2.Πa:nat. (α1)list(a) ∗ (α2)list(a) → (α1 ∗ α2)list(a)

	then zip can no longer be applied to two lists of unequal length.

	In short, we can now use dependent types to eliminate various (but certainly not all) occurrences of expressions in M-form or U-form, which would not have been possible previously.

	----

	Now suppose that we have two lists xs and ys of unknown length, that is, they are of the type Σa:nat. (τ )list(a) for some type τ . In order to apply zip to xs and ys, we can insert a run-time check as follows:

		let
			val m = length (xs) and n = length (ys)
		in
			if m = n then zip (xs, ys) else raise UnequalLength
		end

	where the integer equality function = and the list length function length are assumed to be of the following types:

		= : Πa1 :int.Πa2 :int. int(a1) ∗ int(a2) → bool(a1.= a2)
		length : ∀α.Πa:nat. (α)list(a) → int(a)

	Of course, we also have the option to implement another zip function that can directly handle lists of unequal length, but this implementation is less efficient than
	the one given in Figure 18.

- 4.5 Type index erasure

	In general, there are two directions for extending a type system such as the one in ML:

	One is to extend it so that more programs can be admitted as type-correct, and the other is to extend it so that programs can be assigned more accurate types.

	In this paper, we are primarily interested in the latter as is shown below.

	----

	We can define a function | · | in Figure 19 that translates types, contexts and expressions in λΠ,Σ pat into types, contexts and expressions in λpat, respectively.

	In particular, for each type family δ in λΠ,Σ pat , we assume that there is a corresponding type δ in λpat, and for each constant c of c-type Πφ.P~ ⊃ (τ ⇒ δ(~I)) in λΠ,Σ pat , we assume that c is assigned the c-type |τ | ⇒ δ in λpat.

	- Theorem 4.13

		Assume that φ; P~ ; Γ ` e : τ is derivable in λ Π,Σ pat .
		Then |Γ| ` |e| : |τ | is derivable in λpat.

	- Proof

		(Sketch) By structural induction on the derivation of φ; P~; Γ ` e : τ . □

			|δ(
			~I)| = δ
			|1| = 1
			|τ1 ∗ τ2| = |τ1| ∗ |τ2|
			|τ1 → τ2| = |τ1| → |τ2|
			|P ⊃ τ | = |τ |
			|Πa:s. τ | = |τ |
			|P ∧ τ | = |τ |
			|Σa:s. τ | = |τ |
			|∅| = ∅
			|Γ, xf : τ | = |Γ|, xf : |τ |
			|xf | = xf
			|c(e)| = c(|e|)
			|case e of (p1 ⇒ e1 | . . . | pn ⇒ en)| = case |e| of (p1 ⇒ |e1| | . . . | pn ⇒ |en|)
			|hi| = hi
			|he1, e2i| = h|e1|, |e2|i
			|fst(e)| = fst(|e|)
			|snd(e)| = snd(|e|)
			|lam x. e| = lamx. |e|
			|e1(e2)| = |e1|(|e2|)
			|fix f. e| = fix f. |e|
			|⊃
			+(e)| = |e|
			|⊃
			−(e)| = |e|
			|Π
			+(e)| = |e|
			|Π
			−(e)| = |e|
			| ∧(e)| = |e|
			|let ∧(x) = e1 in e2 end| = let x = |e1| in |e2| end
			|Σ(e)| = |e|
			|let Σ(x) = e1 in e2 end| = let x = |e1| in |e2| end

			Fig. 19. The erasure function | · | on types, contexts and expressions in λΠ,Σ pat

	Given a closed expression e0 in λpat, we say that e0 is typable in λpat if ∅ ` e0 : τ0 is derivable for some type τ0; and we say that e0 is typable in λΠ,Σ pat if there exists an expression e in λΠ,Σ pat such that |e| = e0 and ∅; ∅; ∅ ` e : τ is derivable for some type τ .

	Then by Theorem 4.13, we know that if an expression e in λpat is typable in λΠ,Σ pat then it is already typable in λpat. In other words, λΠ,Σ pat does not make more expressions in λpat typable.

	- Theorem 4.14

		Assume that ∅; ∅; ∅ ` e : τ is derivable.

		1. If e ,→∗
			ev v in λ
			Π,Σ
			pat , then |e| ,→∗
			ev |v| in λpat.
		2. If |e| ,→∗
			ev v0 in λpat, then there is a value v such that e ,→∗
			ev v in λ
			Π,Σ
			pat and
			|v| = v0.

	- Proof

		(Sketch) It is straightforward to prove (1). As for (2), it follows from structural induction on the derivation of ∅; ∅; ∅ ` e : τ . □

	Theorem 4.14 indicates that we can evaluate a well-typed program in λΠ,Σ pat by first erasing all the markers Π+(·), Π−(·), ⊃+(·), ⊃−(·), Σ(·) and ∧(·) in the program and then evaluating the erasure in λpat.

	Combining Theorem 4.13 and Theorem 4.14, we say that λΠ,Σ pat is a conservative extension of λpat in terms of both static and dynamic semantics.

- 4.6 Dynamic subtype relation
	
	The dynamic subtype relation defined below is much stronger than the static subtype relation ≤s tp and it plays a key role in Section 5, where an elaboration process is presented to facilitate program construction in λΠ,Σ pat .

	- Definition 4.15 (Dynamic Subtype Relation)

		We write φ; P~ |= E : τ ≤d tp τ0 to mean that for any expression e and context Γ, if φ; P~ ; Γ ` e : τ is derivable then both φ; P~ ; Γ ` E[e] : τ0 is derivable and |e| ≤dyn |E[e]| holds.

		We may write φ; P~ |= τ ≤d tp τ0 if, for some E, φ; P~ |= E : τ ≤d tp τ0 holds, where E can be thought of as a witness to τ ≤d tp τ0.

		As is desired, the dynamic subtype relation ≤d tp is both reflexive and transitive.

	- Proposition 4.16 (Reflexitivity and Transitivity of ≤d tp)

		1. φ; P~ |= [] : τ ≤d tp τ holds for each τ such that φ ` τ [type] is derivable.
		2. φ; P~ |= E2[E1] : τ1 ≤d tp τ3 holds if φ; P~ |= E1 : τ1 ≤d tp τ2 and φ; P~ |= E2 : τ2 ≤d tp τ3 do, where E2[E1] is the evaluation context formed by replacing the hole [] in E2 with E1.

	- Proof

		(Sketch) The proposition follows from the fact that the relation ≤dyn is both re-flexive and transitive. □

- 4.7 A restricted form of dependent types
	
	Generally speaking, we use the name dependent types to refer to a form of types that correspond to formulas in some first-order many-sorted logic. For instance, the following type in λΠ,Σ pat :

		Πa:int. a ≥ 0 ⊃ (int(a) → int(a + a))

	corresponds to the following first-order formula:

		∀a : int.a ≥ 0 ⊃ (int(a) → int(a + a))

	where int is interpreted as some predicate on integers, and both ⊃ and → stand for the implication connective in logic. However, it is not possible in λΠ,Σ pat to form a dependent type of the form Πa : τ1. τ2, which on the other hand is allowed in a expressions

		e ::= x | c(e) | case e of (p1 ⇒ e1
		| . . . pn ⇒ en
		) |
		hi | he1
		, e2
		i | fst(e) | snd(e) |
		lamx. e | lamx : τ. e | e1
		(e2
		) |
		fix f : τ. e | let x = e1
		in e2
		end |
		λa : sˆ. e | e[I] | (e : τ )
		Fig. 20. The syntax for DML0

	(full) dependent type system such as λP (Barendregt, 1992).

	To see the difficulty in supporting practical programming with such types that may depend on programs, let us recall the following rule that is needed for determining the static subtype relation ≤s tp in λΠ,Σ pat :

		φ; P~ |= I
		.= I
		0
		φ; P~ |= δ(I) ≤s
		tp δ(I
		0
		)
		If I and I
		0 are programs, then I
		.= I
		0

	is an equality on programs.

	In general, if recursion is allowed in program construction, then it is not just undecidable to determine whether two programs are equal; it is simply intractable.

	In addition, such a design means that the type system of a programming language can be rather unstable as adding a new programming feature into the programming language may significantly affect the type system.

	For instance, if some form of effect (e.g., exceptions, references) is added, then equality on programs can at best become rather intricate to define and is in general impractical to reason about.

	Currently, there are various studies aiming at addressing these difficulties in order to support full dependent types in practical programming.

	For instance, a plausible design is to separate pure expressions from potentially effectful ones by employing monads and then require that only pure expressions be used to form types.

	As for deciding equalities on (pure) expressions, the programmer may be asked to provide proofs of these equalities. Please see (McBride, n.d.; Westbrook et al., 2005) for further details.

	----
	
	We emphasize that the issue of supporting the use of dependent types in practical programming is largely not shared by Martin-L¨of’s development of constructive type theory (Martin-L¨of, 1984; Martin-L¨of, 1985), where the principal objective is to give a constructive foundation of mathematics.

	In such a pure setting, it is perfectly reasonable to define type equality in terms of equality on programs (or more accurately, proofs).

- 5 Elaboration

	We have so far presented an explicitly typed language λΠ,Σ pat .

	This presentation has a serious drawback from the point of view of a programmer:

	One may quickly be overwhelmed with the need for writing types when programming in such a setting.

	It then becomes apparent that it is necessary to provide an external language DML0 together with a mapping from DML0 to the internal language λΠ,Σ pat , and we call such a mapping elaboration.

	We may also use the phrase type-checking loosely to mean elaboration, sometimes.

	----

	We are to introduce a set of rules to perform elaboration.

	The elaboration process itself is nondeterministic.

	Nonetheless, we can guarantee based on Theorem 5.3 that if e in DML0 can be elaborated into e in λΠ,Σ pat , then e and e are operationally equivalent.

	In other words, elaboration cannot alter the dynamic semantics of a program.

	This is what we call the soundness of elaboration, which is considered a major contribution of the paper.

	We are to perform elaboration with bi-directional strategy that casually resembles the one adopted by Pierce and Turner in their study on local type inference (Pierce & Turner, 1998), where the primary focus is on the interaction between polymorphism and subtyping.

	----

	We present the syntax for DML0 in Figure 20, which is rather similar to that of λΠ,Σ pat .

	In general, it should not be difficult to relate the concrete syntax used in our program examples to the formal syntax of DML0.

	We now briefly explain as to how some concrete syntax can be used to provide type annotations for functions.

	We essentially support two forms of type annotations for functions, both of which are given below:
	
		fun succ1 (x) = x + 1
		withtype {a:int | a >= 0} int (a) -> int (a+1)

		fun succ2 {a:int | a >= 0} (x: int(a)): int(a+1) = x + 1

	The first form of annotation allows the programmer to easily read out the type of the annotated function while the second form makes it more convenient to handle a case where the body of a function needs to access some bound type index variables in the type annotation.

	The concrete syntax for the definition of succ1 translates into the following formal syntax,

		fix f : τ. λa : s. ˆ lamx : int(a).(x + 1 : int(a + 1))

	where sˆ = {a : int | a ≥ 0}, and so does the concrete syntax for the definition of succ2.

	As an example, both forms of annotation are involved in the following program, which computes the length of a given list:

		fun length {n:nat} (xs: ’a list n): int n =
		let // this is a tail-recursive implementation
		fun aux xs j = case xs of
		| nil => j
		| cons (_, xs) => aux xs (j+1)
		withtype {i:nat, j:nat | i+j=n} ’a list i -> int j -> int n
		in
		aux xs 0
		end

	Note that the type index variable n is used in the type annotation for the inner auxiliary function aux .

	----

	In the following presentation, we may use ⊃ + n (·) for ⊃ +(. . .(⊃ +(·)). . .), where

		φ; P~ |= I1
		.
		= I
		0
		1 · · · φ; P~ |= In
		.
		= I
		0
		n
		φ;P~ ` [] : δ(I1, . . . , In) ≤ δ(I
		0
		1, . . . , I
		0
		n)
		(dy-sub-base)
		φ; P~ ` [] : 1 ≤ 1
		(dy-sub-unit)
		φ; P~ ; x1 : τ1, x2 : τ2 ` hx1, x2i ↓ τ ⇒ e
		φ;P~ ` let hx1, x2i = [] in e end : τ1 ∗ τ2 ≤ τ
		(dy-sub-prod)
		φ;P~ ; x : τ, x1 : τ1 ` x(x1) ↓ τ2 ⇒ e
		φ; P~ ` let x = [] in lamx1. e end : τ ≤ τ1 → τ2
		(dy-sub-fun)
		sˆ = {a : s | P1, . . . , Pn} φ, a : s; P~ , P1, . . . , Pn ` E : τ ≤ τ
		0
		φ; P~ ` Π
		+(⊃
		+
		n (E)) : τ ≤ Πa:sˆ. τ
		0
		(dy-sub-Π-r)
		sˆ = {a : s | P1, . . . , Pn} φ, a : s; P~ , P1, . . . , Pn ` E : τ ≤ τ
		0
		φ; P~ ` let Σ(∧n(x)) = [] in E[x] end : Σa:s. ˆ τ ≤ τ
		0
		(dy-sub-Σ-l)
		sˆ = {a : s | P1, . . . , Pn} φ ` I : sˆ φ; P~ ` E : τ [a 7→ I] ≤ τ
		0
		φ; P~ ` E[⊃
		−
		n (Π−([]))] : Πa:sˆ. τ ≤ τ
		0
		(dy-sub-Π-l)
		sˆ = {a : s | P1, . . . , Pn} φ ` I : sˆ φ; P~ ` E : τ ≤ τ
		0
		[a 7→ I]
		φ; P~ ` Σ(∧n(E)) : τ ≤ Σa:sˆ. τ
		0
		(dy-sub-Σ-r)
		Fig. 21. The dynamic subtype rules in λΠ,Σ pat.

	there are n occurrences of ⊃ +, and ∧n(·) for ∧(. . .(∧(·)). . .), where there are n occurrences of ∧, and let Σ(∧0(x)) = e1 in e2 end for let Σ(x) = e1 in e2 end, and let Σ(∧n+1(x)) = e1 in e2 end for the following expression: let Σ(∧n(x)) = (let ∧ (x) = e1 in x end) in e2 end, where n ranges over natural numbers.

	- Proposition 5.1

		We have |let x = e1 in e2 end| ≤dyn |let Σ(∧n(x)) = e1 in e2 end|.

	- Proof

		This immediately follows from Lemma 2.14 and the observation that

			|let Σ(∧n(x)) = e1 in e2 end| ,→∗g |let x = e1 in e2 end|

		holds. □

- 5.1 The judgments and rules for elaboration

	We introduce a new form of judgment φ; P~ ` E : τ1 ≤ τ2, which we call dynamic subtype judgment.

	We may write φ; P~ ` τ1 ≤ τ2 to mean φ; P~ ` E : τ1 ≤ τ2 for some evaluation context E.

	The rules for deriving such a new form of judgment are given in Figure 21.

	We are to establish that if φ; P~ ` E : τ ≤ τ0 is derivable, then φ; P~ |= E : τ ≤d tp τ0 holds, that is, for any expression e of type τ , E[e] can be assigned the type τ0 and |e| ≤dyn |E[e]| holds.

	----

	There is another new form of judgment φ; P~; Γ ` e ↓ τ ⇒ e involved in the rule (dy-sub-prod) and the rule (dy-sub-fun), and the rules for deriving such a judgment, which we call analysis elaboration judgment, are to be presented next.
	
	----

	We actually have two forms of elaboration judgments involved in the process of elaborating expressions from DML0 to λΠ,Σ pat .

	- A synthesis elaboration judgment is of the form φ; P~; Γ ` e ↑ τ ⇒ e, which means that given φ, P~ , Γ and e, we can find a type τ and an expression e such that φ; P~ ; Γ ` e : τ is derivable and |e| ≤dyn |e| holds.
		Intuitively, τ can be thought of as being synthesized through an inspection on the structure of e.
	- An analysis elaboration judgment is of the form φ; P~ ; Γ ` e ↓ τ ⇒ e, which means that given φ; P~ ; Γ, e and τ , we can find an expression e such that φ; P~; Γ ` e : τ is derivable and |e| ≤dyn |e| holds.
	
	We use |e| for the erasure of an expression e in DML0, which is obtained from erasing in e all occurrences of the markers Π+(·), Π−(·), ⊃ +(·), ⊃ −(·), Σ(·) and ∧(·).

	The erasure function is formally defined in Figure 24.

	----

	The rules for deriving synthesis and analysis elaboration judgments are given in Figure 22 and Figure 23, respectively.

	Note that there are various occasions where the two forms of elaboration judgments meet.

	For instance, when using the rule (elab-up-app-1) to elaborate e1(e2), we may first synthesize a type τ1 → τ2 for e1 and then check e2 against τ1.

	----

	We next present some explanation on the elaboration rules.

	First and foremost, we emphasize that many elaboration rules are not syntax-directed.

	If in a case there are two or more elaboration rules applicable, the actual elaboration procedure should determine (based on some implementation strategies) which elaboration rule is to be chosen.

	We are currently not positioned to argue which implementation strategies are better than others, though we shall mention some key points about the strategies we have implemented.

	Given that the elaboration is not a form of pure type inference,1 it is difficult to even formalize the question as to whether an implementation of the elaboration is complete or not.
	
- 5.2 Some explanation on synthesis elaboration rules

	The rules for synthesis elaboration judgments are presented in Figure 22.

	The purpose of the rules (elab-up-Π-elim-1) and (elab-up-Π-elim-2) is for eliminating Π quantifiers.

	For instance, let us assume that we are elaborating an expression e1 (e2), and a type of the form Πa : s. ˆ τ is already synthesized for e1; then we need to apply the rule (elab-up-Π-elim-1) so as to eliminate the Π quantifier in


	----

	1 By pure type inference, we refer to the question that asks whether a given expression in λpat is typable in λΠ,Σ pat , that is, whether a given expression in λpat can be the erasure of some typable expression in λΠ,Σ pat .

		sˆ = {a : s | P1, . . . , Pn} φ;P~ ` I : sˆ φ; P~ ; Γ ` e ↑ Πa:sˆ. τ ⇒ e
		φ; P~ ; Γ ` e ↑ τ [a 7→ I] ⇒⊃−
		n (Π−(e))
		(elab-up-Π-elim-1)
		sˆ = {a : s | P1, . . . , Pn} φ;P~ ` I : sˆ φ; P~ ; Γ ` e ↑ Πa:sˆ. τ ⇒ e
		φ;P~ ; Γ ` e[I] ↑ τ [a 7→ I] ⇒⊃−
		n (Π−(e))
		(elab-up-Π-elim-2)
		sˆ = {a : s | P1, . . . ,Pn} φ, a : s;P~ ,P1, . . . ,Pn; Γ ` e ↑ τ ⇒ e
		φ;P~ ; Γ ` λa : s. ˆ e ↑ Πa:s. ˆ τ ⇒ Π+(⊃
		+
		n (e))
		(elab-up-Π-intro)
		φ;P~ ; Γ ` e ↓ τ ⇒ e
		φ; P~ ; Γ ` (e : τ ) ↑ τ ⇒ e
		(elab-up-anno)
		φ ` Γ [ctx] Γ(xf ) = τ
		φ; P~ ; Γ ` xf ↑ τ ⇒ xf
		(elab-up-var)
		φ0; P~0 ` c(τ0) : δ(I~0) φ ` Θ : φ0 φ |= P~0[Θ] φ;P~ ; Γ ` e ↓ τ0[Θ] ⇒ e
		φ; P~ ; Γ ` c(e) ↑ δ(I~0[Θ]) ⇒ c(e)
		(elab-up-const)
		φ;P~ ; Γ ` e1
		↑ τ1 ⇒ e1 φ;P~ ; Γ ` e2
		↑ τ2 ⇒ e2
		φ;P~ ; Γ ` he1
		, e2
		i ↑ τ1 ∗ τ2 ⇒ he1, e2i
		(elab-up-prod)
		φ;P~ ; Γ ` e ↑ τ1 ∗ τ2 ⇒ e
		φ;P~ ; Γ ` fst(e) ↑ τ1 ⇒ fst(e)
		(elab-up-fst)
		φ;P~ ; Γ ` e ↑ τ1 ∗ τ2 ⇒ e
		φ;P~ ; Γ ` snd(e) ↑ τ2 ⇒ snd(e)
		(elab-up-snd)
		φ; P~ ; Γ, x : τ1 ` e ↑ τ2 ⇒ lamx. e
		φ;P~ ; Γ ` lamx : τ1. e ↑ τ1 → τ2 ⇒ lamx. e
		(elab-up-lam)
		φ;P~ ; Γ ` e1
		↑ τ1 → τ2 ⇒ e1 φ;P~ ; Γ ` e2
		↓ τ1 ⇒ e2
		φ;P~ ; Γ ` e1
		(e2
		) ↑ τ2 ⇒ e1(e2)
		(elab-up-app-1)
		φ;P~ ; Γ ` e1
		↑ τ ⇒ e1 φ;P~ ; Γ ` e2
		↑ τ1 ⇒ e2
		φ;P~ ; x1 : τ, x2 : τ1 ` x1(x2) ↑ τ2 ⇒ e
		φ; P~ ; Γ ` e1
		(e2
		) ↑ τ2 ⇒ let x1 = e1 in let x2 = e2 in e end end
		(elab-up-app-2)
		φ;P~ ; Γ, f : τ ` e ↓ τ ⇒ e
		φ;P~ ; Γ ` fix f : τ. e ↑ τ ⇒ fix f. e
		(elab-up-fix)
		φ;P~ ; Γ ` e1
		↑ τ1 ⇒ e1 φ;P~ ; Γ, x : τ1 ` e2
		↑ τ2 ⇒ e2
		φ;P~ ; Γ ` let x = e1
		in e2
		end ↑ τ2 ⇒ let x = e1 in e2 end
		(elab-up-let)
		φ;P~ ; Γ, x1 : τ1, x2 : τ2 ` e[x 7→ hx1, x2i] ↑ τ ⇒ e
		φ;P~ ; Γ, x : τ1 ∗ τ2 ` e ↑ τ ⇒ let hx1, x2i = x in e end
		(elab-up-prod-left)
		sˆ = {a : s | P1, . . . ,Pn} φ, a : s;P~ ,P1, . . . ,Pn; Γ, x : τ1 ` e ↑ τ2 ⇒ e
		φ;P~ ; Γ, x : Σa:s. ˆ τ1 ` e ↑ Σa:s. ˆ τ2 ⇒ let Σ(∧n(x)) = x in Σ(∧n(e)) end
		(elab-up-Σ-left)

		Fig. 22. The rules for synthesis elaboration from DML0 to λΠ,Σ pat

	Πa : s. ˆ τ ; we continue to do so until the synthesized type for e1 does not begin with a Π quantifier. 

	In some (rare) occasions, the programmer may write e[I] to indicate an explicit elimination of a Π quantifier, and the rule (elab-up-Π-elim-2) is designed for this purpose.

	----

	The rule (elab-up-anno) turns a need for a synthesis elaboration judgment into
	
		sˆ = {a : s | P1, . . . ,Pn} φ, a : s;P~ , P1, . . . , Pn; Γ ` e ↓ τ ⇒ e
		φ; P~ ; Γ ` e ↓ Πa:s. ˆ τ ⇒ Π+(⊃
		+
		n (e))
		(elab-dn-Π-intro)
		φ;P~ ; Γ ` e1
		↓ τ1 ⇒ e1 φ;P~ ; Γ ` e2
		↓ τ2 ⇒ e2
		φ; P~ ; Γ ` he1
		, e2
		i ↓ τ1 ∗ τ2 ⇒ he1, e2i
		(elab-dn-prod)
		φ;P~ ; Γ, x : τ1 ` e ↓ τ2 ⇒ lamx. e
		φ;P~ ; Γ ` lamx. e ↓ τ1 → τ2 ⇒ lamx. e
		(elab-dn-lam)
		p ↓ τ1 ⇒ (φ0;P~0; Γ0) φ, φ0;P~ ,P~0; Γ, Γ0 ` e ↓ τ2 ⇒ e
		φ; P~ ; Γ ` (p ⇒ e) ↓ (τ1 → τ2) ⇒ (p ⇒ e)
		(elab-dn-clause)
		φ; P~ ; Γ ` (pi ⇒ ei
		) ↓ (τ1 → τ2) ⇒ (pi ⇒ ei) for 1 ≤ i ≤ n
		ms = (p1 ⇒ e1
		| . . . | pn ⇒ en
		) ms = (p1 ⇒ e1 | . . . | pn ⇒ en)
		φ;P~ ; Γ ` ms ↓ τ1 → τ2 ⇒ ms
		(elab-dn-clause-seq)
		φ;P~ ; Γ ` e ↑ τ1 ⇒ e φ;P~ ; Γ ` ms ↓ τ1 → τ2 ⇒ ms
		φ; P~ ; Γ ` case e of ms ↓ τ2 ⇒ case e of ms
		(elab-dn-case)
		φ;P~ ; Γ ` e ↑ τ1 ⇒ e φ;P~ ` E : τ1 ≤ τ2
		φ;P~ ; Γ ` e ↓ τ2 ⇒ E[e]
		(elab-dn-up)
		φ; P~ ; Γ, x1 : τ1, x2 : τ2 ` e[x 7→ hx1, x2i] ↓ τ ⇒ e
		φ; P~ ; Γ, x : τ1 ∗ τ2 ` e ↓ τ ⇒ let hx1, x2i = x in e end
		(elab-dn-prod-left)
		sˆ = {a : s | P1, . . . ,Pn} φ, a : s;P~ , P1, . . . , Pn; Γ, x : τ1 ` e ↓ τ2 ⇒ e
		φ;P~ ; Γ, x : Σa:s. ˆ τ1 ` e ↓ τ2 ⇒ let Σ(∧n(x)) = x in e end
		(elab-dn-Σ-left)

	- Fig. 23. The rules for analysis elaboration from DML0 to λ

		Π,Σ
		pat
		|xf | = xf
		|c(e)| = c(|e|)
		|case e of (p1 ⇒ e1
		| . . . | pn ⇒ en
		)| = case |e| of (p1 ⇒ |e1
		| | . . . | pn ⇒ |en
		|)
		|hi| = hi
		|he1
		, e2
		i| = h|e1
		|, |e2
		|i
		|fst(e)| = fst(|e|)
		|snd(e)| = snd(|e|)
		|lam x. e| = lamx. |e|
		|lam x : τ. e| = lamx. |e|
		|e1
		(e2
		)| = |e1
		|(|e2
		|)
		|fix f : τ. e| = fix f. |e|
		|let x = e1
		in e2
		end| = let x = |e1
		| in |e2
		| end
		|(e : τ )| = |e|
		|λa : sˆ. e| = |e|
		|e[I]| = |e|

	- Fig. 24. The erasure function on expressions in DML0

		τ1 = Πa1 :nat. int(a1) → Σa2 :nat. int(a2)
		τ2(a) = int(a) → Σa2 :nat. int(a2)
		τ3 = Σa2 :nat. int(a2)
		e1 = ⊃−(Π−(f))(1)
		e2 = ⊃−(Π−(x1))
		e3 = let Σ(∧(x2)) = x2 in ⊃−(Π−(x1))(x2) end
		e4 = let x1 = f in let x2 = e1 in e3 end end
		D0 :: ∅; ∅; ∅, f : τ1 ` f ↑ τ1 ⇒ f
		(elab-up-var)
		D0 ∅; ∅ ` 1 : nat
		D1 :: ∅; ∅; ∅, f : τ1 ` f ↑ τ2(1) ⇒⊃−(Π−(f))
		(elab-up-Π-elim-1)
		D2 :: ∅; ∅; ∅, f : τ1 ` 1 ↑ int(1) ⇒ 1
		(elab-up-const)
		D1
		D2
		∅; ∅ |= 1
		.= 1
		∅; ∅ ` [] : int(1) ≤ int(1)
		(dy-sub-base)
		∅; ∅; ∅, f : τ1 ` 1 ↓ int(1) ⇒ 1
		(elab-dn-up)
		D3 :: ∅; ∅; ∅, f : τ1 ` f(1) ↑ τ3 ⇒ e1
		(elab-up-app-1)
		D4 :: ∅, a2 : int; ∅, a2 ≥ 0; ∅, x1 : τ1, x2 : int(a2) ` x1 ↑ τ1 ⇒ x1
		(elab-up-var)
		D4 ∅, a2 : int; ∅, a2 ≥ 0 ` a2 : nat
		D5 :: ∅, a2 : int; ∅, a2 ≥ 0; ∅, x1 : τ1, x2 : int(a2) ` x1 ↑ τ2(a2) ⇒ e2
		(elab-up-Π-elim-1)
		D6 :: ∅, a2 : int; ∅, a2 ≥ 0; ∅, x1 : τ1, x2 : int(a2) ` x2 ↑ int(a2) ⇒ x2
		(elab-up-var)
		D5
		D6
		∅, a2 : int; ∅, a2 ≥ 0 |= a2
		.
		= a2
		∅, a2 : int; ∅, a2 ≥ 0 ` [] : int(a2) ≤ int(a2)
		(dy-sub-base)
		∅, a2 : int; ∅, a2 ≥ 0; ∅, x1 : τ1, x2 : int(a2) ` x2 ↓ int(a2) ⇒ x2
		(elab-dn-up)
		∅, a2 : int; ∅, a2 ≥ 0; ∅, x1 : τ1, x2 : int(a2) ` x1(x2) ↑ τ3 ⇒ e2(x2)
		(elab-up-app-1)
		D7 :: ∅; ∅; ∅, x1 : τ1, x2 : τ3 ` x1(x2) ↑ Σa:nat. τ3 ⇒ e3
		(elab-up-Σ-left)
		D0 D3 D7
		D8 :: ∅; ∅; ∅, x1 : τ1, x2 : τ3 ` f(f(1)) ↑ Σa:nat. τ3 ⇒ e4
		(elab-up-app-2)

	- Fig. 25. An example of elaboration

	a need for an analysis elaboration judgment.

	For instance, we may encounter a situation where we need to synthesize a type for some expression lamx. e; however, there is no rule for such a synthesis as the involved expression is a lam-expression; to address the issue, the programmer may provide a type annotation by writing (lamx. e : τ ) instead; synthesizing a type for (lamx. e : τ ) is then reduced to analyzing whether lam x. e can be assigned the type τ .

	----

	The rule (elab-up-app-1) is fairly straightforward. When synthesizing a type for e1(e2), we can first synthesize a type for e1; if the type is of the form τ1 → τ2, we can then analyze whether e2 can be assigned the type τ1; if the analysis succeeds, then we claim that the type τ2 is synthesized for e2.

	----

	The rule (elab-up-app-2) is rather intricate but of great importance in practice, and we provide some explanation for it. When synthesizing a type for e1(e2), we may first synthesize a type τ for e1 that is not of the form τ1 → τ2; for instance, τ may be a universally quantified type; if this is the case, we can next synthesize a type for e2 and then apply the rule (elab-up-app-2). Let us now see a concrete example involving (elab-up-app-2). Suppose that f is given the following type:

		Πa1 :nat. int(a1) → Σa2 :nat. int(a2)
		where nat = {a : int | a ≥ 0}, and we need to elaborate the expression f(1).

	By applying the rule (elab-Π-elim-1) we can synthesize the type int(1) → Σa2 : nat. int(a2) for f; then we can analyze that 1 has the type int(1) and thus synthesize
	the type Σa2 :nat. int(a2) for f(1); note that f(1) elaborates into ⊃ −(Π−(f))(1), which can be assigned the type Σa2 : nat. int(a2).

	Now suppose that we need to elaborate the expression f(f(1)).

	If we simply synthesize a type of the form int(I) → Σa2 :nat. int(a2) for the first occurrence of f in f(f(1)), then the elaboration for f(f(1)) cannot succeed as it is impossible to elaborate f(1) into an expression in λΠ,Σ pat of the type int(I) for any type index I.

	With the rule (elab-up-app-2), we are actually able to elaborate f(f(1)) into the following expression e in λΠ,Σ pat :

		let x1 = f in let x2 =⊃−(Π−(f))(1) in e
		0 end end
		where e
		0 = let Σ(∧(x2)) = x2 in ⊃ −(Π−(x1))(x2) end.

	Please find that the entire elaboration is formally carried out in Figure 25.

	Clearly, the erasure of e is operationally equivalent to f(f(1)).

	----

	The rules (elab-up-prod-left) and (elab-up-Σ-left) are for simplifying the types assigned to variables in a dynamic context. In practice, we apply these rules during elaboration whenever possible.

- 5.3 Some explanation on analysis elaboration rules
	
	The rules for analysis elaboration judgments are presented in Figure 23.

	For instance, if e = he1, e2 i and τ = hτ1, τ2i, then the rule (elab-dn-prod) reduces the question whether e can be assigned the type τ to the questions whether ei can be assigned the types τi for i = 1, 2. Most of analysis elaboration rules are straightforward.
	
	In the rule (elab-dn-up), we see that the three forms of judgments (dynamic subtype judgment, synthesis elaboration judgment and analysis elaboration judgment) meet.

	This rule simply means that when analyzing whether an expression e can be given a type τ2, we may first synthesize a type τ1 for e and then show that τ1 is a dynamic subtype of τ2 (by showing that E : τ1 ≤ τ2 is derivable for some evaluation context E).

	In practice, we apply the rule (elab-dn-up) only if all other analysis elaboration rules are inapplicable.

	----

	We now show some actual use of analysis elaboration rules by presenting in Figure 26 a derivation of the following judgment for some E:
	
		∅; ∅ ` E : Nat ∗ Nat ≤ Σa1 :nat.Σa2 :nat. int(a1) ∗ int(a2)

	where Nat = Σa : nat. int(a). In this derivation, we assume the existence of a

		τ0 = int(a1) ∗ int(a2)
		τ1 = Σa2 :nat. int(a1) ∗ int(a2)
		τ2 = Σa1 :nat.Σa2 :nat. int(a1) ∗ int(a2)
		φ1 = ∅, a1 : int
		φ2 = ∅, a1 : int, a2 : int
		P~1 = ∅, a1 ≥ 0
		P~2 = ∅, a1 ≥ 0, a2 ≥ 0
		E0 = Σ(∧(Σ(∧(let hx1, x2i = [] in hx1, x2i end))))
		e1 = E0[hx1, x2i]
		e2 = let Σ(∧(x2)) = x2 in e1 end
		e3 = let Σ(∧(x1)) = x1 in e2 end
		E = let hx1, x2i = [] in e3 end
		D1 :: φ2;P~2; x1 : int(a1), x2 : int(a2) ` x1 ↑ int(a1) ⇒ x1
		(elab-var-up)
		D2 :: φ2;P~2; x1 : int(a1), x2 : int(a2) ` x2 ↑ int(a2) ⇒ x2
		(elab-var-up)
		D1
		φ2; P~2 |= a1
		.
		= a1
		φ2; P~2 ` [] : int(a1) ≤ int(a1)
		D3 :: φ2; P~2; x1 : int(a1), x2 : int(a2) ` x1 ↓ int(a1) ⇒ x1
		(elab-dn-up)
		D2
		φ2; P~2 |= a2
		.= a2
		φ2; P~2 ` [] : int(a2) ≤ int(a2)
		D4 :: φ2; P~2; x1 : int(a1), x2 : int(a2) ` x2 ↓ int(a2) ⇒ x2
		(elab-dn-up)
		D3 D4
		D5 :: φ2; P~2; x1 : int(a1), x2 : int(a2) ` hx1, x2i ↓ τ0 ⇒ hx1, x2i
		(elab-dn-prod)
		D5 D0 :: φ2;P~2 ` E0 : τ0 ≤ τ2
		D6 :: φ2; P~2; x1 : int(a1), x2 : int(a2) ` hx1, x2i ↓ τ2 ⇒ e1
		(elab-dn-up)
		φ1; P~1; x1 : int(a1), x2 : Nat ` hx1, x2i ↓ τ2 ⇒ e2
		(elab-dn-Σ-left)
		∅; ∅; x1 : Nat, x2 : Nat ` hx1, x2i ↓ τ2 ⇒ e3
		(elab-dn-Σ-left)
		D7 :: ∅; ∅ ` E : Nat ∗ Nat ≤ τ2
		(dy-sub-prod)

	- Fig. 26. Another example of elaboration

	derivation D0 :: φ2; P~2 ` E0 : τ0 ≤ τ2 for the following evaluation context E0:

		Σ(∧(Σ(∧(let hx1, x2i = [] in hx1, x2i end))))

	which can be readily constructed.

	----

	As another example, the interested reader can readily derive the following judgment for some E:

		∅; ∅ ` E : Πa:int. int(a) → int(a) ≤ Int → Int

	where Int = Σa : int. int(a).

	Therefore, we can always use a function of the type

		Πa:int. int(a) → int(a) as a function of the type Int → Int.
	
- 5.4 The soundness of elaboration

	We now prove the soundness of elaboration, that is, elaboration cannot alter the dynamic semantics of a program.

	To make the statement more precise, we define in Figure 24 an erasure function | · | from DML0 to λpat. The following lemma is the key to establishing the soundness of elaboration.
	
	- Lemma 5.2
	
		Given φ, P~, Γ, e, τ, τ0 and e, we have the following:
		
		1. If φ; P~ ` E : τ ≤ τ0 is derivable, then φ; P~ |= E : τ ≤d tp τ0 holds.
		2. If φ; P~; Γ ` e ↑ τ ⇒ e is derivable, then φ; P~ ; Γ ` e : τ is derivable in λ Π,Σ pat , and |e| ,→∗ g |e| holds.
		3. If φ; P~; Γ ` e ↓ τ ⇒ e is derivable, then φ; P~ ; Γ ` e : τ is derivable in λ Π,Σ pat ,and |e| ,→∗ g |e| holds.

	- Proof

		(Sketch) (1), (2) and (3) are proven simultaneously by structural induction on the derivations of φ; P~ ` E : τ ≤ τ0, φ; P~; Γ ` e ↑ τ ⇒ e and φ; P~; Γ ` e ↓ τ ⇒ e. □

	The soundness of elaboration is justified by the following theorem:

	- Theorem 5.3

		Assume that ∅; ∅; ∅ ` e ↑ τ ⇒ e is derivable.

		Then ∅; ∅; ∅ ` e : τ is derivable and |e| ≤dyn |e|.

	- Proof

		This follows from Lemma 5.2 and Lemma 2.14 immediately. □

- 5.5 Implementing elaboration

	A typed programming language ATS is currently under development (Xi, 2005), and its type system supports the form of dependent types in λΠ,Σ pat .

	The elaboration process in ATS is implemented in a manner that follows the presented elaboration rules closely, providing concrete evidence in support of the practicality of these rules.

	We now mention some strategies adopted in this implementation to address nondeterminism in elaboration.

	- The dynamic subtype rules in Figure 21 are applied according to the order in which they are listed.

		In other words, if two or more dynamic subtype rules are applicable, then the one listed first is chosen. It is important to always choose (dy-sub-Π-r) and (dy-sub-Σ-l) over (dy-sub-Π-l) and (dy-sub-Σ-r), respectively.

	For instance, this is necessary when we prove ∅; ∅ ` τ ≤ τ for τ = Πa:int. int(a) → int(a) and also for τ = Σa:int. int(a).

	- The following ”left” rules:
		— (elab-up-Σ-left) and (elab-dn-Σ-left)
		— (elab-up-prod-left) and (elab-dn-prod-left)
		are chosen whenever they are applicable.

	- The rule (elab-up-app-2) is in general chosen over the rule (elab-up-app-1).

		However, we also provide some special syntax to allow the programmer to indicate that the rule (elab-up-app-1) is preferred in a particular case.

		For instance, the special syntax for doing this in ATS is {...}: we write e1 {...}(e2) to indicate that a type of the form τ1 → τ2 needs to be synthesized out of e1 and then e2 is to be checked against τ1.

		This kind of elaboration is mostly used in a case where the expression e1 is a higher-order function, saving the need for explicitly annotating the expression e2.

	- We choose the rule (elab-dn-up), which turns analysis into synthesis, only when no other analysis elaboration rules are applicable.

		The general principle we follow is to prefer analysis over synthesis as the former often makes better use of type annotations and yields more accurate error message report.

	While the description of elaboration in terms of the rules in Figure 21, Figure 22 and Figure 23 is intuitively appealing, there is still a substantial gap between the description and its implementation.

	For instance, the elaboration rules are further refined in (Xi, 1998) to generate constraints when applied, and there are also various issues of reporting error messages as informative as possible.

	As these issues are mostly concerned with an actual implementation of elaboration, they are of relatively little theoretical significance and thus we plan to address them elsewhere in different contexts.

- 6 Extensions
	
	We extend λΠ,Σ pat with parametric polymorphism, exceptions and references in this section, attesting to the adaptability and practicality of our proposed approach to supporting the use of dependent types in the presence of realistic programming features.

- 6.1 Parametric polymorphism
	
	We first extend the syntax of λΠ,Σ pat as follows:

		types τ ::= . . . | α
		type schemes σ ::= ∀α~. τ
		contexts Γ ::= · | Γ, xf : σ

	where we use α to range over type variables. A c-type is now of the following form:
	
		∀α. ~ Πφ.P~ ⊃ (τ ⇒ (~τ )δ(~I))

	and the typing rules (ty-var) and (ty-const) are modified as follows:

		Γ(xf) = ∀α. ~ τ φ ` ~τ [type]
		φ; P~; Γ ` xf : τ [α~ 7→ ~τ ]
		(ty-var)
		α~; φ0; P~
		0 ` c(τ ) : (~τ0)δ(~I0) φ ` ~τ [type]
		φ ` Θ : φ0 φ; P~ |= P~
		0[Θ] φ; P~; Γ ` e : τ [α~ 7→ ~τ ][Θ]
		φ; P~ ; Γ ` c(e) : (~τ0[α~ 7→ ~τ ])δ(~I0[Θ])
		(ty-const)

	We write α~; φ0; P~0 ` c(τ ) : (~τ0)δ(~I0) to indicate that the constant c is assigned the c-type ∀α~.Πφ0.P~0 ⊃ (τ ⇒ δ(~I0)), and φ ` ~τ [type] to mean that φ ` τ [type] is derivable for each τ in ~τ , and [α~ 7→ ~τ ] for a substitution that maps α~ = α1, . . . , αn to ~τ = τ1, . . . , τn. We now need the following static subtype rule to deal with type variables:
	
		φ; P~ |= α ≤s
		tp α
		(st-sub-var)

	In addition, the rule (st-sub-base) needs to be modified as follows:

		φ; P~ |= τ1 =s
		tp τ
		0
		1
		· · · φ; P~ |= τm =s
		tp τ
		0
		m
		φ; P~ |= I1
		.= I
		0
		1
		· · · φ; P~ |= In
		.= I
		0
		n
		φ; P~ |= (τ1, . . . , τm)δ(I1, . . . , In) ≤s
		tp (τ
		0
		1
		, . . . , τ
		0
		m)δ(I
		0
		1
		, . . . , I
		0
		n)
		(st-sub-base)

	where for types τ and τ0, τ =s tp τ0 means both τ ≤s tp τ 0 and τ 0 ≤s tp τ hold.

	It is possible to replace τi =s tp τ0 i with τi ≤s tp τ0 i (τ0 i ≤s tp τi) if δ is covariant (contravariant) with respect to its i th type argument.

	However, we do not entertain this possibility in this paper (but do so in implementation).

	----

	The following typing rules (ty-poly) and (ty-let) are introduced for handling let-polymorphism as is supported in ML:

		φ; P~ ; Γ ` e : τ α~ # Γ
		φ; P~; Γ ` e : ∀α. ~ τ
		(ty-poly)
		φ; P~ ; Γ ` e1 : σ1 φ; P~ ; Γ, x : σ1 ` e2 : σ2
		φ; P~; Γ ` let x = e1 in e2 end : σ2
		(ty-let)

	Obviously, we need to associate with the rule (ty-poly) a side condition that requires no free occurrences of α~ in Γ. This condition is written as α~ # Γ.

	----

	As usual, the type soundness of this extension is established by the subject reduction theorem and the progress theorem stated as follows:

	- Theorem 6.1 (Subject Reduction)

		Assume that D :: ∅; ∅; ∅ ` e1 : σ is derivable and e1 ,→ev e2 holds. Then ∅; ∅; ∅ ` e2 : σ is also derivable.

	- Theorem 6.2 (Progress)

	Assume that ∅; ∅; ∅ ` e1 : σ is derivable. Then there are the following possibilities:

		c(raise(v)) ,→ev raise(v)
		hraise(v), ei ,→ev raise(v)
		hv0, raise(v)i ,→ev raise(v)
		(raise(v))(e) ,→ev raise(v)
		v0(raise(v)) ,→ev raise(v)
		case raise(v) of ms ,→ev raise(v)
		let x = raise(v) in e end ,→ev raise(v)
		⊃
		−(raise(v)) ,→ev raise(v)
		Π
		−(raise(v)) ,→ev raise(v)
		let ∧(x) = raise(v) in e end ,→ev raise(v)
		let Σ(x) = raise(v) in e end ,→ev raise(v)
		try raise(v) with ms ,→ev
		
		
		
		e[θ] if match(v, p) ⇒ θ holds
		for some p ⇒ e in ms;
		raise(v) otherwise.

		Fig. 27. Additional forms of redexes and their reducts

	- e1 is a value, or
	- e1 is in M-form, or
	- e1 is in U-form, or
	- e1 ,→ev e2 holds for some expression e2.

	We omit the proofs for these two theorems, which are essentially the same as the ones for Theorem 4.11 and Theorem 4.12.

- 6.2 Exceptions

	We further extend λΠ,Σ pat with exceptions.

	First, we introduce the following additional syntax, where exn is the type for values representing exceptions.

		types τ ::= . . . | exn
		expressions e ::= . . . | raise(e) | try e with ms
		answers ans ::= v | raise(v)

	An answer of the form raise(v) is called a raised exception, where v is the exception being raised.

	We also introduce in Figure 27 some new forms of ev-redexes and their reducts, which are needed for propagating a raised exception to the top level.

	In addition, we introduce a new form of evaluation context to allow a raised exception to be captured (potentially):

		evaluation contexts E ::= . . . | try E with ms

	The following typing rules are needed for handling the newly added language constructs:

		φ; P~; Γ ` e : exn
		φ; P~; Γ ` raise(e) : σ
		(ty-raise)
		φ; P~ ; Γ ` e : τ φ; P~; Γ ` ms : exn → τ
		φ; P~ ; Γ ` try e with ms : τ
		(ty-try)

	Again, the type soundness of this extension rests upon the following two theorems:

	- Theorem 6.3 (Subject Reduction)

		Assume D :: ∅; ∅; ∅ ` e1 : σ e1 ,→ev e2. Then ∅; ∅; ∅ ` e2 : σ is also derivable.

	- Theorem 6.4 (Progress)

		Assume that ∅; ∅; ∅ ` e1 : σ is derivable.

		Then there are the following possibilities:

		- e1 is a value, or
		- e1 is a raised exception, or
		- e1 is in M-form, or
		- e1 is in U-form, or
		- e1 ,→ev e2 holds for some expression e2.

		We omit the proofs for these two theorems, which are essentially the same as the ones for Theorem 4.11 and Theorem 4.12.
		
		----

		Assume the existence of two exception constants Match and Undefined that are assigned the c-type () ⇒ exn.

		We can then introduce the following evaluation rules for handling expressions in M-form or U-form:
		case v of ms ,→ev raise(Match) if v matches none of the patterns in ms.
		cf(v) ,→ev raise(Undefined) if cf(v) is undefined.

		Then the progress theorem can be stated as follows:

	- Theorem 6.5 (Progress)

		Assume that ∅; ∅; ∅ ` e1 : σ is derivable. Then there are the following possibilities:

		- e1 is a value, or
		- e1 is a raised exception, or
		- e1 ,→ev e2 holds for some expression e2.

		So we can now claim that the evaluation of a well-typed program either terminates with an answer, that is, a value or a raised exception, or goes on forever.
	
- 6.3 References

	In this section, we add into λΠ,Σ pat another effectful programming feature: references.

	We first introduce a unary type constructor ref that takes a type τ to form a reference type (τ )ref.

	We need the following static subtype rule for dealing with the type constructor ref:

		φ; P~ |= τ1 ≤s
		tp τ2 φ; P~ |= τ2 ≤s
		tp τ1
		φ; P~ |= (τ1)ref ≤s
		tp (τ2)ref
		(st-sub-ref)

	which takes into account that ref is nonvariant on its type argument.

	We also assume the existence of the following predefined functions ref, ! (prefix) and := (infix) with the assigned c-types:

		ref : ∀α.(α) ⇒ (α)ref
		! : ∀α.((α)ref) ⇒ α
		:= : ∀α.((α)ref, α) ⇒

	We use l to range over an infinite set of reference constants l1, l2, . . ., which one may simply assume are represented as natural numbers.

	We use M and µ for stores and store types, respectively, which are defined below as finite mappings:

		stores M ::= [] | M[l 7→ v]
		store types µ ::= [] | µ[l 7→ τ ]

	Note that we do allow type variables to occur in a store type.

	In other words, for each l ∈ dom(µ), µ(l) may contain free type variables.

	----

	We say that a store M0 extends another store M if M(l) = M0 (l) for every l ∈ dom(M) ⊆ dom(M0).

	Similarly, we say that a store type µ0 extends another store type µ if µ(l) = µ0 (l) for every l ∈ dom(µ) ⊆ dom(µ0).

	- Definition 6.6 (Stateful Reduction)

		The stateful reduction relation (M1, e1) ,→ev/st (M2, e2) is defined as follows:

		- If e1 ,→ev e2 holds, then we have (M, e1) ,→ev/st (M, e2).

		- If e1 = E[ref(v)], then we have (M, e1) ,→ev/st (M[l 7→ v], E[hi]) for any reference constant l 6∈ dom(M).

			So nondeterminism appears to be involved in this case.

			This form of nondeterminism can be eliminated if we equate (M, e) and (M0, e0) whenever one can be obtained from the other by properly renaming the reference constants. The precise definition of such a renaming algorithm is omitted as it is not needed in this paper.

		- If e1 = E[!l] and M(l) = v, then we have (M, e1) ,→ev/st (M, E[v]).

		- If e1 = E[l := v] and l ∈ dom(M), then we have (M, e1) ,→ev/st (M0, E[hi]),
		where M0
		is a store such that dom(M0
		) = dom(M) and M0
		(l) = v and
		M0
		(l
		0
		) = M(l
		0
		) for every l
		0
		in dom(M) that is not l.
		As usual, we use ,→∗
		ev/st for the reflexive and transitive closure of ,→ev/st.
		Given an answer ans, we say that ans is observable if ans = v or ans = raise(v)
		for some observable value v.

	- Definition 6.7

		Given two expressions e1 and e2 in λpat extended with polymorphism, exceptions and references, we say that e1 ≤dyn e2 holds if for any store M1 and any

		context G, either (M1, G[e2]) ,→∗
		ev/st (M2, Error) holds for some store M2, or
		(M1, G[e1]) ,→∗
		ev/st (M2, ans∗
		) if and only if (M1, G[e2]) ,→∗
		ev/st (M2, ans∗
		), where
		M2 ranges over stores and ans∗
		ranges over the set of observable answers.

		The definition of the dynamic subtype relation ≤d tp (Definition 4.15) can be modified according to the above definition of ≤dyn.

		In particular, we can readily verify that Lemma 2.14 still holds (as the generate reduction relation ,→g is still defined in the same manner).

		We now outline as follows an approach to typing references, which is largely based upon the one presented in (Harper, 1994).

		A typing judgment is now of the form φ; P~; Γ `µ e : σ, and all the previous typing rules need to be modified accordingly.

		Also, we introduce the following typing rule for assigning types to reference constants:
		
			µ(l) = τ
			φ; P~ ; Γ `µ l : (τ )ref
			(ty-ref)

		We say that an expression e is value-equivalent if |e| ≤dyn v holds for some value v.

		A form of value restriction is imposed by the following rules:

			φ; P~ , P; Γ `µ e : τ e is value-equivalent
			φ; P~; Γ `µ⊃+(e) : P ⊃ τ
			(ty-⊃-intro)
			φ, a : s; P~; Γ `µ e : τ e is value-equivalent
			φ; P~ ; Γ `µ Π+(e) : Πa:s. τ
			(ty-Π-intro)
			φ; P~ ; Γ `µ e : τ α~ # Γ α~ # µ e is value-equivalent
			φ; P~; Γ `µ e : ∀α~. τ
			(ty-poly)

		In the rule (ty-poly), α~ # µ means that there is no free occurrence of α in µ(l) for any α ∈ α~, where l ranges over dom(µ).

		Also, we need to extend the definition of evaluation contexts as follows:

			E ::= . . . | ⊃+(E) | Π
			+(E)

		As an example, when applying the rule (ty-Π-intro) to an expression, we need to verify that the expression must be value-equivalent.

		This is slightly different from the usual form of value restriction(Wright, 1995) imposed, for instance, in ML.

		The minor change is needed since the elaboration of a value may not necessarily be a value.

		For instance, this may happen if the rule (elab-dn-up) is applied.

		By Lemma 5.2 and Lemma 2.14, we know that the elaboration of a value is always value-equivalent.

		Given a store M and a store type µ, we write M : µ to mean that the store M can be assigned the store type µ, which is formally defined as follows:

			∅; ∅; ∅ `µ M(l) : µ(l) for every l ∈ dom(M) = dom(µ)
			M : µ
			(ty-store)

		Again, the type soundness of this extension rests upon the following two theorems:

	- Theorem 6.8 (Subject Reduction)

		Assume M1 : µ1 holds and ∅; ∅; ∅ `µ1 e1 : σ is derivable. If (M1, e1) ,→ev/st (M2, e2) holds, then there exists a store typing µ2 that extends µ1 such that M2 : µ2 holds and ∅; ∅; ∅ `µ2 e2 : σ is derivable.

	- Theorem 6.9 (Progress)

		Assume that M : µ holds and ∅; ∅; ∅ `µ e : σ is derivable.

		Then there are the following possibilities:

		- e is a value v, or
		- e is a raised exception raise(v), or
		- (M, e) ,→ev/st (M0, e0) holds for some store M0 and expression e0 such that M0 extends M.

		The proofs for these two theorems are essentially the same as the ones for Theorem 4.11 and Theorem 4.12, and some related details can also be found in (Harper, 1994).

		In Appendix C, we provide a proof sketch for Theorem 6.8 that clearly demonstrates some involvement of value restriction.

- 7 Some programming examples

	We have finished prototyping a language Dependent ML (DML), which essentially extends ML with a form of dependent types in which type index terms are drawn from the type index languages Lint and Lalg presented in Section 3.3.2 and Section 3.3.1, respectively.

	At this moment, DML has already become a part of ATS, a programming language with a type system rooted in the framework Applied Type System (Xi, 2004).

	The current implementation of ATS is available on-line (Xi, 2005), which includes a type-checker and a compiler (from ATS to C) and a substantial library (containing more than 25K lines of code written in ATS itself).

	When handling integer constraints, we reject nonlinear ones outrightly rather than postpone them as hard constraints (Michaylov, 1992), which is planned for future work.

	This decision of rejecting nonlinear integer constraints may seem ad hoc, and it can be too restrictive, sometimes, in a situation where nonlinear constraints (e.g., ∀n : int. n ∗ n ≥ 0) need to be dealt with.

	To address this issue, an approach to combining programming with theorem proving has been proposed recently (Chen & Xi, 2005a).

	If the constraints are linear, we negate them and test for unsatisfiability.

	For instance, the following is a sample constraint generated when an implementation　of binary search on arrays is type-checked:

		φ; P~ |= l + (h − l)/2 + 1 ≤ sz
		where
		φ = h : int, l : int, sz : int
		P~ = l ≥ 0, sz ≥ 0, 0 ≤ h + 1, h + 1 ≤ sz, 0 ≤ l, l ≤ sz, h ≥ l

	The employed technique for solving linear constraints is mainly based on the FourierMotzkin variable elimination approach (Dantzig & Eaves, 1973), but there are many other practical methods available for this purpose such as the SUP-INF method (Shostak, 1977) and the well-known simplex method.

	We have chosen FourierMotzkin’s method mainly for its simplicity.

	We now briefly explain this method.

	We use x for integer variables, a for integers, and l for linear expressions.

	Given a set of inequalities S, we would like to show that S is unsatisfiable.

	We fix a variable x and transform all the linear inequalities into one of the two forms: l ≤ ax and ax ≤ l, where a ≥ 0 is assumed.

	For every pair l1 ≤ a1x and a2x ≤ l2, where a1, a2 > 0, we introduce a new inequality a2l1 ≤ a1l2 into S, and then remove from S all the inequalities involving x.

	Clearly, this is a sound but incomplete procedure.

	If x were a real variable, then the procedure would also be complete.

	In order to handle modulo arithmetic, we also perform another operation to rule out non-integer solutions: we transform an inequality of form

		a1x1 + · · · + anxn ≤ a

	Recently,, we have also implemented a constraint solver based the simplex method.

	Our experience indicates that Fourier-Motzkin’s method is almost always superior to the the simplex method due to the nature of the constraints encountered in practice.

		into a1x1 + · · · + anxn ≤ a0,
		where a
		0
		is the largest integer such that a
		0 ≤ a and the greatest common divisor
		of a1, . . . , an divides a
		0.

	The method can be extended to become both sound and complete while remaining practical (see, for example, (Pugh & Wonnacott, 1992; Pugh & Wonnacott, 1994)).

	In DML, we do allow patterns in a matching clause sequence to be overlapping, and sequential pattern matching is performed at run-time.

	This design can lead to some complications in type-checking, which will be mentioned in Section 7.2.

	Please refer to (Xi, 2003) for more details on this issue.
	
	We now present some programing examples taken from a prototype implementation of DML, giving the reader some concrete feel as to how dependent types can actually be used to capture programming invariants in practice.

- 7.1 Arrays

	Arrays are a widely used data structure in practice.

	We use array as a built-in type constructor that takes a type τ and a natural number n to form the type (τ )array(n) for arrays of size n in which each element has the type τ.

	We also have the built-in functions sub, update and make, which are given the following c-types:

		sub : ∀α.Πn:nat.Πi:{a : nat | a < n}. (α)array(n) ∗ int(i) ⇒ α
		update : ∀α.Πn:nat.Πi:{a : nat | a < n}. (α)array(n) ∗ int(i) ∗ α ⇒ 1
		make : ∀α.Πn:nat. int(n) ∗ α ⇒ (α)array(n)

	There is no built-in function for computing the size of an array.

	Notice that the c-type of sub indicates that the function can be applied to an array and an index only if the value of the index is a natural number less than the size of the array.

	In other words, the quantification Πn : nat.Πi : {a : nat | a < n} acts like a precondition for the function sub.

	The c-type of update imposes a similar requirement.

	We may, however, encounter a situation where the programmer knows or believes for some reason that the value of the index is within the bounds of the array, but this property is difficult or even impossible to be captured in the type system of DML.

	In such a situation, the programmer may need to use run-time array bound checks to overcome the difficulty. We now present some type-theoretical justification for run-time array bound checking in DML.

	In Figure 28, we declare a type constructor Array for forming types for arrays with size information.

	The only value constructor Array associated with the type constructor Array is assigned the following c-type:

		∀α.Πn:nat. int(n) ∗ (α)array(n) ⇒ (α)Array(n)

	The defined functions arraySub, arrayUpdate and makeArray correspond to the 3 Each valid index of an array is a natural number less than the size of the array datatype ’a Array with nat = {n:nat} Array(n) of int(n) * ’a array(n) exception Subscript

		fun(’a) arraySub (Array(n, a), i) =
		if (i < 0) then raise Subscript
		else if (i >= n) then raise Subscript
		else sub (a, i)
		withtype {n:nat,i:int} ’a Array(n) * int(i) -> ’a
		fun(’a) arrayUpdate (Array(n, a), i, x) =
		if (i < 0) then raise Subscript
		else if (i >= n) then raise Subscript
		else update (a, i, x)
		withtype {n:nat,i:int} ’a Array(n) * int(i) * ’a -> unit
		fun(’a) makeArray (n, x) = Array (n, make (n, x))
		withtype {n:nat} int(n) * ’a -> ’a Array(n)
		fun(’a) arrayLength (Array(n, _)) = n
		withtype {n:nat} ’a Array(n) -> int(n)

		Fig. 28. A datatype for arrays with size information and some related functions

	functions sub, update and make, respectively.

	Note that run-time array bound checks are inserted in the implementation of arraySub and arrayUpdate.

	For an array carrying size information, the function arrayLength simply extracts out the information.

	Additional examples can be found in (Xi & Pfenning, 1998) that makes use of dependent types in eliminating run-time array bound checks.

	Clearly, the programmer now has the option to decide which subscripting (updating) function should be used: sub or arraySub (update or arrayUpdate)?

	When compared to the former, the latter is certainly less efficient and may incur a runtime exception.

	However, in order to use the former, the programmer often needs to capture more program invariants by supplying type annotations.

	This point is shown clearly when we compare the two (essentially identical) implementations of the standard binary search on integer arrays in Figure 29.

	In the first implementation, we use the array subscripting function arraySub, which incurs run-time array bound checks.

	In the second implementation, we instead use sub, which incurs no run-time array bound checks.

	Clearly, the second implementation is superior to the first one when either safety or efficiency is of the concern.

	However, the programmer needs to provide a more informative type for the inner function loop in order to eliminate the array bound checks.

	In this case, the provided type captures the invariant that i ≤ j +1 ≤ n holds whenever loop is called, where i and j are integer values of l and u, respectively, and n is the size of the array being searched.
	
		datatype ORDER = LESS | EQUAL | GREATER
		fun binarySearch cmp (key, Vec) = let (* require run-time bound checks *)
		fun loop (l, u) =
		if u < l then NONE
		else let
		val m = l + (u-l) / 2
		val x = arraySub (Vec, m) (* require bound checks *)
		in case cmp (x, key) of
		LESS => loop (m+1, u)
		| GREATER => loop (l, m-1)
		| EQUAL => SOME (m)
		end
		withtype int * int -> int option
		in loop (0, length Vec - 1) end
		withtype {n:nat} (’a * ’a -> Bool) -> (’a * ’a Array(n)) -> int option
		fun binarySearch cmp (key, Vec) = let (* require NO run-time bound checks *)
		val Array (n, vec) = Vec
		fun loop (l, u) =
		if u < l then NONE
		else let
		val m = l + (u-l) / 2
		val x = sub (vec, m) (* require no bound checks *)
		in case cmp (x, key) of
		LESS => loop (m+1, u)
		| GREATER => loop (l, m-1)
		| EQUAL => SOME (m)
		end
		withtype {i:nat,j:int | i <= j+1 <= n} int(i) * int(j) -> int option
		in loop (0, n-1) end
		withtype {n:nat} (’a * ’a -> Bool) -> (’a * ’a Array(n)) -> int option

		Fig. 29. Two implementations of binary search on integer arrays in DML

- 7.2 Red-black trees

	We now show a typical use of dependent types in capturing certain inherent invariants in data structures.

	A red-black tree (RBT) is a balanced binary tree that satisfies the following conditions:

	1. All leaves are marked black and all other nodes are marked either red or black;
	2. for every node there are the same number of black nodes on every path connecting the node to a leaf, and this number is called the black height of the node;
	3. the two children of every red node are black.

	It is a common practice to use the RBT data structure to implement a dictionary.

	We declare a datatype in Figure 30, which precisely captures the above three properties of being a RBT.

		sort color = {a:int | 0 <= a <= 1} (* sort declaration *)
		datatype ’a rbtree (color, nat, nat) = (* color, black height, violation *)
		E(0, 0, 0)
		| {cl:color, cr:color, bh:nat}
		B(0, bh+1, 0) of ’a rbtree(cl, bh, 0) * ’a * ’a rbtree(cr, bh, 0)
		| {cl:color, cr:color, bh:nat}
		R(1, bh, cl+cr) of ’a rbtree(cl, bh, 0) * ’a * ’a rbtree(cr, bh, 0)
		fun restore (R(R(a, x, b), y, c), z, d) = R(B(a, x, b), y, B(c, z, d))
		| restore (R(a, x, R(b, y, c)), z, d) = R(B(a, x, b), y, B(c, z, d))
		| restore (a, x, R(R(b, y, c), z, d)) = R(B(a, x, b), y, B(c, z, d))
		| restore (a, x, R(b, y, R(c, z, d))) = R(B(a, x, b), y, B(c, z, d))
		| restore (a, x, b) = B(a, x, b)
		withtype {cl:color, cr:color, bh:nat, vl:nat, vr:nat | vl+vr <= 1}
		’a rbtree(cl, bh, vl) * ’a * ’a rbtree(cr, bh, vr) ->
		[c:color] ’a rbtree(c, bh+1, 0)
		exception ItemAlreadyExists
		fun insert cmp (x, t) = let
		fun ins (E) = R(E, x, E)
		| ins (B (a, y, b)) = (
		case cmp (x, y) of
		LESS => restore (ins a, y, b)
		| GREATER => restore(a, y, ins b)
		| EQUAL => raise ItemAlreadyExists
		)
		| ins (R (a, y, b)) = (
		case cmp (x, y) of
		LESS => R (ins a, y, b)
		| GREATER => R(a, y, ins b)
		| EQUAL => raise ItemAlreadyExists
		)
		withtype {c:color, bh:nat}
		’a rbtree(c, bh, 0) -> [c’:color, v:nat | v <= c] ’a rbtree(c’, bh, v)
		in case ins t of R(a, y, b) => B(a, y, b) | t => t end
		withtype {c:color, bh:nat} (’a * ’a -> ORDER) ->
		key * ’a rbtree(c, bh, 0) -> [bh’:nat] ’a rbtree(0, bh’, 0)

		Fig. 30. A red-black tree implementation

	A sort color is declared for the type index terms representing the colors of nodes.
	
	We use 0 for black and 1 for red.

	The type constructor rbtree is indexed with a triple (c, bh, v), where c, bh, v stand for the color of the node, the black height of the tree rooted at the node, and the number of color violations in the tree, respectively.

	We record one color violation if a red node is followed by another red one, and thus a valid RBT must have no color violations.

	Clearly, the types of value constructors associated with the type constructor rbtree indicate that color violations can only occur at the top node.

	Also, notice that a leaf, that is, E, is considered black.

	Given the datatype declaration and the explanation, it should be clear that the type of a RBT in which all keys are of type τ is simply:

		Σc:color.Σbh:nat. (τ )rbtree(c, bh, 0),

	that is, a RBT is a tree that has some top node color c and some black height bh but no color violations.

	It is an involved task to implement RBT.

	The implementation we present in Figure 30 is largely adopted from one in (Okasaki, 1998), though there are some minor modifications. We explain how the insertion operation on a RBT is implemented.

	Clearly, the invariant we intend to capture is that inserting an entry into a RBT yields another RBT.

	In other words, we intend to declare that the insertion operation has the following type:

		∀α.(α ∗ α → Bool) → α ∗ (α)RBT → (α)RBT

	where Bool is the type for booleans and (α)RBT is defined to be:

		Σc:color.Σbh:nat. (α)rbtree(c, bh, 0)

	If we insert an entry into a RBT, some properties on RBT may be invalidated, and the invalidated properties can then be restored through some rotation operations.
	
	The function restore in Figure 30 is defined for this purpose.
	
	The type of restore, though long, is easy to understand.

	It states that this function takes a tree with at most one color violation, an entry and a RBT, and returns a RBT.

	The two trees in the argument must have the same black height bh for some natural number bh and the black height of the returned RBT is bh + 1.

	This information can be of great help for understanding the code. It is not trivial at all to verify the information manually, and we could imagine that almost everyone who did this would appreciate the availability of a type-checker to perform it automatically.

	There is a substantial difference between type-checking a matching clause sequence in DML and in ML.

	The operational semantics of ML requires that pattern matching be performed sequentially, that is, the chosen pattern matching clause is always the first one that matches a given value.

	For instance, in the definition of the function restore, if the last clause is chosen at run-time, then we know the argument of restore does not match any one of the clauses ahead of the last one.

	This must be taken into account when we type-check pattern matching in DML. One approach is to expand patterns into disjoint ones.

	For instance, the pattern (a, x, b) expands into 36 patterns (pattern1, x, pattern2), where pattern1 and pattern2 range over the following six patterns:
		
		R(B , , B ), R(B , , E), R(E, , B ), R(E, , E), B , E
	
	Unfortunately, such an expansion may lead to combinatorial explosion.

	An alternative is to require the programmer to indicate whether such an expansion is needed.

	Neither of these was available in the original implementation of DML, and the author had to take the inconvenience to expand patterns into disjoint ones when necessary.

	Recently, we have implemented the alternative mentioned above.

	For instance, the last clause in the definition of restore can be written as follows:

		| restore (a, x, b) == B(a, x, b)

	where the special symbol == indicates to the type-checker that the pattern involved here needs to be (automatically) expanded into ones that are disjoint from the the patterns in the previous clauses.

	For a thorough study on the issue of type-checking pattern matching clauses in DML, please refer to (Xi, 2003).
	
	The complete implementation of the insertion operation follows immediately.
	
	Notice that the type of the function ins indicates that ins may return a tree with one color violation if it is applied to a tree with a red top node.

	This violation can be eliminated by replacing the top node with a black one for every returned tree with a red top node.
	
	Moreover, we can use an extra index to capture the size information of a RBT.

	If we do so, we can then show that the insert function always returns a RBT of size n+1 when given a RBT of size n (note that an exception is raised if the entry to be inserted already exists in the tree).

	A complete implementation of red-black trees is available on-line (Xi, 2005), which includes deletion and join operations as well.

	Also, several examples that make use of dependent types in capturing invariants in other data structures (e.g., Braun trees, random-access lists, binomial heaps) can be found in (Xi, 1999).
	
	We point out that it is also possible to capture the invariants of being a RBT by using nested datatypes (Kahrs, 2001).

	This is a rather different approach as it, to a large extent, employs run-time checking (in the form of pattern matching) to ensure that a binary tree meets the criteria of being a red-black tree.

	The use of nested datatypes essentially guarantees the adequacy of such run-time checking.

	A more systematic study on making use of nested types in capturing program invariants can be found in (Hinze, 2001).

- 7.3 A type-preserving evaluator
	
	We now implement an evaluator for an object language based on the simply typed λ-calculus, capturing in the type system of DML that the evaluator is type-preserving at the object level.

	Apart form using integer expressions as type indexes in the previous examples, we employ algebraic terms as type indexes in this example.

	We use the following syntax to define a sort ty for representing simple types in the object language:
	
		datasort ty = Bool | Int | Arrow of (ty, ty)
	
	where we assume that Bool and Int represent two simple base types ˆbool and int ˆ , respectively, and Arrow represents (the overloaded) constructor → for forming simple
	function types. For instance, we use the term Arrow(Int, Arrow(Int,Bool)) to represent the simple type int ˆ → (intˆ → ˆbool) in the object language, where ˆbool and int ˆ are two simple base types and (the overloaded) → is a simple type constructor.

	We use a form of higher-order abstract syntax (h.o.a.s) (Church, 1940; Pfenning & Elliott, 1988; Pfenning, n.d.) to represent expressions in the object language.

	In Figure 31, we declare a type constructor EXP, which takes a type

		datatype EXP (ty) =
		EXPint (Int) of int
		| EXPbool (Bool) of bool
		| EXPadd (Int) of EXP (Int) * EXP (Int)
		| EXPsub (Int) of EXP (Int) * EXP(Int)
		| EXPmul(Int) of EXP (Int) * EXP (Int)
		| EXPdiv(Int) of EXP (Int) * EXP (Int)
		| EXPzero (Bool) of EXP (Int)
		| {a: ty} EXPif (a) of EXP (Bool) * EXP (a) * EXP (a)
		| {a1: ty, a2: ty} EXPlam (Arrow (a1, a2)) of (EXP (a1) -> EXP (a2))
		| {a1: ty, a2: ty} EXPapp (a2) of (EXP (Arrow (a1, a2)), EXP (a1))
		| {a1: ty, a2: ty} EXPlet (a2) of (EXP (a1), (EXP(a1) -> EXP(a2)))
		| {a: ty} EXPfix (a) of (EXP (a) -> EXP (a))
		Fig. 31. A datatype for higher-order abstract syntax

	index term I of sort ty to form a type EXP(I) for the values that represent closed expressions in the object language that can be assigned the type represented by I.

	For example, the function λx : int ˆ .x + x in the object language is represented as EXPlam(lam x. EXPadd(x, x)), which can be given the type EXP(Arrow(Int,Int)).

	The usual factorial function can be represented as follows (in the concrete syntax of DML),

		EXPfix (lam f =>
		EXPlam (lam x =>
		EXPif (EXPzero (x),
		EXPint(1),
		EXPmul (x, EXPapp (f, EXPsub (x, EXPint(1)))))))

	which can also be given the type EXP(Arrow(Int,Int)).

	We often refer to such a representation as a form of typeful representation since the type of an expression in the object language is now reflected in the type of the representation of the expression.

	We now implement a function evaluate in Figure 32.

	The function is an evaluator for the object language, taking (the representation of) an object expression and returning (the representation of) the value of the object expression. Notice that the function is assigned the type Πa:ty. EXP(a) → EXP(a), indicating that the function is type-preserving at the object level.

	Also, we point out that (extended) type-checking in DML guarantees that no pattern matching failure can occur in this example.
	
	Clearly, a natural question is whether we can also implement a type-preserving evaluator for an object language based on the second-order polymorphic λ-calculus or system F (Girard, 1972).

	In order to do so, we need to go beyond algebraic terms, employing λ-terms to encode polymorphic types in the object language.

	First we extend the definition of the sort ty as follows so that universally quantified types can also be represented:

		datasort ty = ... | All of (ty -> ty)
		fun evaluate (v as EXPint _) = v
		| evaluate (v as EXPbool _) = v
		| evaluate (EXPadd (e1, e2)) = let // no pattern matching failure
		val EXPint (i1) = evaluate e1 and EXPint (i2) = evaluate e2
		in EXPint (i1+i2) end
		(* the cases for EXPsub, EXPmul, EXPdiv are omitted *)
		| evaluate (EXPzero e) = let // no pattern matching failure
		val EXPint (n) = evaluate e
		in EXPbool (n=0) end
		| evaluate (EXPif (e0, e1, e2)) = let // no pattern matching failure
		val EXPbool (b) = evaluate e0
		in if b then evaluate e1 else evaluate e2 end
		| evaluate (EXPapp (e1, e2)) = let // no pattern matching failure
		val EXPlam (f) = evaluate e1
		in evaluate (f (evaluate e2)) end
		(* the case for EXPlet is omitted *)
		| evaluate (v as EXPlam _) = v
		| evaluate (e as EXPfix f) = evaluate (f e)
		withtype {a: ty} EXP (a) -> EXP (a)

		Fig. 32. An implementation of a type-preserving evaluation function in DML

	Given a term f of sort ty → ty, All(f) represents the type ∀α. τ if for each type τ0, f(t) represents the type τ [α 7→ τ0] as long as t represents the type τ0.

	For instance, All(λa.Arrow(a, Arrow(a,Int))) represents the type ∀α.α → α → int; the term All(λa.(All(λb.Arrow(a, Arrow(b, a))))) represents the type ∀α.∀β.α → β → α.

	With this strategy, we have no difficulty in implementing a type-preserving evaluator for an object language based on the second-order polymorphic language calculus.

	We have actually already done this in the programming language ATS (Xi, 2005).

	Note that the type indexes involved in this example are drawn from Lλ.

	It is also possible to implement a type-preserving evaluator through the use of first-order abstract syntax (f.o.a.s), and further details on this subject can be found in (Chen & Xi, 2003; Chen et al., 2005), where some interesting typeful program transformations (e.g., a call-by-value continuation-passing style (CPS) transformation (Meyer & Wand, 1985; Griffin, 1990)) are studied.

	In (Xi et al., 2003), a typeful implementation of simply typed λ-calculus based on guarded recursive (g.r.) datatypes is presented.

	There, a g.r. datatype constructor HOAS (of the kind type → type) is declared such that for each simply typed λ-expression of some simple type T, its representation can be assigned the type (T)HOAS, where T is the representation of T. More precisely, T can be defined as follows:

		b = b T1 → T2 = T1 → T2

	where each simple base type b is represented by a type b (in the implementation language).

	For instance, the type for the representation of the simply typed expression λx : int ˆ .x is (int ˆ → int ˆ )HOAS, where int ˆ is a simple base type.

	With this representation for simply typed λ-calculus, an evaluation function of the type ∀α.(α)HOAS → α can be implemented.

	A particular advantage of this implementation is that we can use native tagless values in the implementation language to directly represent values of object expressions.

	This can be of great use in a setting (e.g., meta-programming) where the object language needs to interact with the implementation language (Chen & Xi, 2005b). Given that DML is a conservative extension of ML, this is clearly something that cannot be achieved in DML.

	The very reason for this is that DML does not allow type equalities like τ1 .= τ2 (meaning both τ1 ≤ τ2 and τ2 ≤ τ1) to appear in index contexts φ.

	In ATS, this restriction is lifted, resulting in a much more expressive type system but also a (semantically) much more complicated constraint relation (on types and type indexes) (Xi, 2004).

- 8 Related work

	Our work falls in between full program verification, either in type theory or systems such as PVS (Owre et al., 1996), and traditional type systems for programming languages.

	When compared to verification, our system is less expressive but more automatic when constraint domains with practical constraint satisfaction problems are chosen.

	Our work can be viewed as providing a systematic and uniform language interface for a verifier intended to be used as a type system during the program development cycle.

	Since it extends ML conservatively, it can be used sparingly as existing ML programs will work as before (if there is no keyword conflict).

	Most closely related to our work is the system of indexed types developed independently by Zenger in his Ph.D.

	Thesis (Zenger, 1998) (an earlier version of which is described in (Zenger, 1997)).

	He worked in the context of lazy functional programming.

	His language is simple and clean and his applications (which significantly overlap with ours) are compelling.

	In general, his approach seems to require more changes to a given Haskell program to make it amenable to checking indexed types than is the case for our system and ML. This is particularly apparent in the case of existentially quantified dependent types, which are tied to data constructors.

	This has the advantage of a simpler algorithm for elaboration and type-checking than ours, but the program (and not just the type) has to be (much) more explicit.

	For instance, one may introduce the following datatype to represent the existentially quantified type Σa:int. int(a):

		datatype IntType = {a: int} Int of int (a)

	where the value constructor Int is assigned the c-type Πa : int. int(a) ⇒ IntType.

	If one also wants a type for natural numbers, then another datatype needs to be introduced as follows:

		datatype NatType = {a: int | a >= 0} Nat of int (a)

	where Nat is assigned the c-type ∀a : int.a ≥ 0 ⊃ (int(a) ⇒ NatType).

	If types for positive integers, negative integers, etc. are wanted, then corresponding datatypes have to be introduced accordingly. Also, one may have to define functions between these datatypes.

	For example, a function from NatType to IntType is needed to turn natural numbers into integers. At this point, we have strong doubts about the viability of such an approach to handling existentially quantified types, especially, in cases where the involved type index terms are drawn from a (rich) type index language such as Lint.

	Also, since the language in (Zenger, 1998) is pure, the issue of supporting indexed types in the presence of effects is not studied there.

	When compared to traditional type systems for programming languages, perhaps the most closely related work is refinement types (Freeman & Pfenning, 1991), which also aims at expressing and checking more properties of programs that are already well-typed in ML, rather than admitting more programs as type-correct, which is the goal of most other research studies on extending type systems.

	However, the mechanism of refinement types is quite different and incomparable in expressive power:

	While refinement types incorporate intersection and can thus ascribe multiple types to terms in a uniform way, dependent types can express properties such as “these two argument lists have the same length” which are not recognizable by tree automata (the basis for type refinements).

	In (Dunfield, 2002), dependent types as formulated in (Xi, 1998; Xi & Pfenning, 1999) are combined with refinement types via regular tree grammar (Freeman & Pfenning, 1991), and this combination shows that these two forms of types can coexist naturally.

	Subsequently, a pure type assignment system that includes intersection and dependent types, as well as union and existential types, is constructed in (Dunfield & Pfenning, 2003).

	This is a rather different approach when compared with the one presented in the paper as it does not employ elaboration as a central part of the development.

	In particular, typechecking is undecidable, and the issue of undecidable type-checking is addressed in (Dunfield & Pfenning, 2004), where a new reconstruction of the rules for indefinite types (existential, union, empty types) using evaluation contexts is given.

	This new reconstruction avoids elaboration and is decidable in theory.

	However, its effectiveness in practice is yet to be substantiated. In particular, the effectiveness of handling existential types through the use contextual type annotations in this reconstruction requires further investigation.

	Parent (Parent, 1995) proposed to reverse the process of extracting programs from constructive proofs in Coq (Dowek et al., 1993), synthesizing proof skeletons from annotated programs.

	Such proof skeletons contain “holes” corresponding to logical propositions not unlike our constraint formulas.

	In order to limit the verbosity of the required annotations, she also developed heuristics to reconstruct proofs using higher-order unification.

	Our aims and methods are similar, but much less general in the kind of specifications we can express.

	On the other hand, this allows a richer source language with fewer annotations and, in practice, avoids direct interaction with a theorem prover.

	Extended ML (Sannella & Tarlecki, 1989) is proposed as a framework for the formal development of programs in a pure fragment of Standard ML.

	The module system of Extended ML can not only declare the type of a function but also the axioms it satisfies.

	This design requires theorem proving during extended typechecking.

	In contrast, we specify and check less information about functions, thus avoiding general theorem proving.

	Cayenne (Augustsson, 1998) is a Haskell-like language in which fully dependent types are available, that is, language expressions can be used as type index objects.

	The price for this is undecidable type-checking in Cayenne.

	For instance, the printf in C, which is not directly typable in ML, can be made typable in Cayenne, and modules can be replaced with records, but the notion of datatype refinement does not exist.

	As a pure language, Cayenne also does not address issue of supporting dependent types in the presence of effects. This clearly separates our language design from that of Cayenne.

	The notion of sized types is introduced in (Hughes et al., 1996) for proving the correctness of reactive systems.

	Though there exist some similarities between sized types and datatype refinement in DML(L) for some type index language L over the domain of natural numbers, the differences are also substantial.

	We feel that the language presented in (Hughes et al., 1996) seems too restrictive for general programming as its type system can only handle (a minor variation) of primitive recursion.

	On the other hand, the use of sized types in the correctness proofs of reactive systems cannot be achieved in DML(L) at this moment.

	Jay and Sekanina (Jay & Sekanina, 1996) have introduced a technique for array bounds checking elimination based on the notion of shape types.

	Shape checking is a kind of partial evaluation and has very different characteristics and source language when compared to DML(L), where constraints are linear inequalities on integers.

	We feel that their design is more restrictive and seems more promising for languages based on iteration schema rather than general recursion.

	A crucial feature in DML(L) that does not exist in either of the above two systems is existential dependent types, or more precisely, existentially quantified dependent types, which is indispensable in our experiment.

	The work on local type inference by Pierce and Turner (Pierce & Turner, 1998), which includes some empirical studies, is also based on a similar bi-directional strategy for elaboration, although they are mostly concerned with the interaction between polymorphism and subtyping, while we are concerned with dependent types.

	This work is further extended by Odersky, Zenger and Zenger in their study on colored local type inference (Odersky et al., 2001).

	However, we emphasize that the use of constraints for index domains is quite different from the use of constraints to model subtyping constraints (see (Sulzmann et al., 1997), for example).

	Along a different but closely related line of research, a new notion of types called guarded recursive (g.r.) datatypes are introduced (Xi et al., 2003).

	Also, phantom types are studied in (Cheney & Hinze, 2003), which are largely identical to g.r.

	In ML, it is possible to implement a function similar to printf, which, instead of applying to a format string, applies to a function argument corresponding to a parsed format string.

	Please see (Danvy, 1998) for further details.
	
	datatypes. Recently, this notion of types are given the name generalized algebraic datatypes (GADTs).

	On the syntactic level, GADTs are of great similarity to universal dependent datatypes in λΠ,Σ pat , essentially using types as type indexes.

	However, unlike DML-style dependent types, ML extended with GADTs is no longer a conservative extension over ML as strictly more programs can be typed in the presence of GADTs.

	On the semantic level, g.r. datatypes are a great deal more complex than dependent types. At this moment, we are not aware of any model-theoretical explanation of GADTs.
	
	Many examples in DML(L) can also be handled in terms of GADTS. As an example, suppose we want to use types to represent natural numbers; we can introduce a type Z and a type constructor S of the kind type → type; for each natural number n, we use S n(Z) to represent n, where S n means n applications of S.

	There are some serious drawbacks with this approach.

	For instance, it cannot rule out forming a type like S(Z∗Z), which does not represent any natural number.

	More importantly, the programmer may need to supply proofs in a program in order for the program to pass type-checking (Sheard, 2004).

	There are also various studies on type inference addressing GADTs (Pottier & R´egis-Gianas, 2006; Jones et al., 2005), which are of rather different focus and style from the elaboration in Section 5.

	Noting the close resemblance between DML-style dependent types and the guarded recursive datatypes, we immediately initiated an effort to unify these two forms of types in a single framework, leading to the design and formalization of Applied Type System (ATS) (Xi, 2004).

	Compared to λΠ,Σ pat , ATS is certainly much more general and expressive, but it is also much more complicated, especially, semantically.

	For instance, unlike in λΠ,Σ pat , the definition of type equality in ATS involves impredicativity.

	In DML, we impose certain restrictions on the syntactic form of constraints so that some effective means can be found for solving constraints automatically.

	Evidently, this is a rather ad hoc design in its nature. In ATS (Xi, 2005), a language with a type system rooted in ATS, we adopt a different design.

	Instead of imposing syntactical restrictions on constraints, we provide a means for the programmer to construct proofs to attest to the validity of constraints.

	In particular, we accommodate a programming paradigm in ATS that enables the programmer to combine programming with theorem proving (Chen & Xi, 2005a).

- 9 Conclusion

	We have presented an approach that can effectively support the use of dependent types in practical programming, allowing for specification and inference of signifi-cantly more precise type information and thus facilitating program error detection and compiler optimization.

	By separating type index terms from programs, we make it both natural and straightforward to accommodate dependent types in the presence of realistic programming features such as (general) recursion and effects (e.g., exceptions and references).

	In addition, we have formally established the type soundness of λΠ,Σ pat , the core dependent type system in our development, and have also justified the correctness of a set of elaboration rules, which play a crucial role in reducing (not eliminating) the amount of explicit type annotation needed in practice.

	On another front, we have finished a prototype implementation of Dependent ML (DML), which essentially extends ML with a restricted form of dependent types such that the type index terms are required to be integer expressions drawn from the type index language Lint presented in Section 3. 

	A variety of programming examples have been constructed in support of the practicality of DML, some of which are shown in Section 7.

	Lastly, we point out that λΠ,Σ pat can be classified as an applied type system in the framework ATS (Xi, 2004).

	At this moment, DML has already been fully incorporated into ATS (Xi, 2005).

	Acknowledgments The current paper is partly based on the author’s doctoral dissertation (Xi, 1998) supervised by Frank Pfenning, and an extended abstract of the dissertation is already in publication (Xi & Pfenning, 1999).

	The author sincerely thanks Frank Pfenning for his suggestion of the research topic and his guidance in the research conducted subsequently.

	In addition, the author acknowledges many discussions with Chiyan Chen regarding the subject of elaboration presented in Section 5 and thanks him for his efforts on proofreading a draft of paper.
	
	Also, the author thanks the anonymous referees for their voluminous constructive comments, which have undoubtedly raised the quality of the paper significantly.
	
- References

	Andrews, Peter B. (1972). General Models, Descriptions and Choice in Type Theory.
	Journal of symbolic logic, 37, 385–394.
	Andrews, Peter B. (1986). An Introduction to Mathematical Logic: To Truth through Proof.
	Orlando, Florida: Academic Press, Inc.
	Augustsson, Lennart. (1998). Cayenne – a language with dependent types. Pages 239–250
	of: Proceedings of the 3rd acm sigplan international conference on functional programming.
	Barendregt, Hendrik Pieter. (1984). The lambda calculus, its syntax and semantics. Revised
	edition edn. Studies in Logic and the Foundations of Mathematics, vol. 103.
	Amsterdam: North-Holland.
	Barendregt, Hendrik Pieter. (1992). Lambda Calculi with Types. Pages 117–441 of:
	Abramsky, S., Gabbay, Dov M., & Maibaum, T.S.E. (eds), Handbook of logic in computer
	science, vol. II. Oxford: Clarendon Press.
	Chen, Chiyan, & Xi, Hongwei. 2003 (June). Implementing Typeful Program Transformations.
	Pages 20–28 of: Proceedings of acm sigplan workshop on partial evaluation and
	semantics based program manipulation.
	Chen, Chiyan, & Xi, Hongwei. 2005a (September). Combining Programming with Theorem
	Proving. Pages 66–77 of: Proceedings of the tenth acm sigplan international conference
	on functional programming.
	Chen, Chiyan, & Xi, Hongwei. (2005b). Meta-Programming through Typeful Code Representation.
	Journal of functional programming, 15(6), 1–39.
	Chen, Chiyan, Shi, Rui, & Xi, Hongwei. (2005). Implementing Typeful Program Transformations.
	Fundamenta informaticae, 69(1-2), 103–121.
	Cheney, James, & Hinze, Ralf. (2003). Phantom Types. Technical Report CUCIS-TR2003-
	1901. Cornell University. Available at
	http://techreports.library.cornell.edu:8081/
	Dienst/UI/1.0/Display/cul.cis/TR2003-1901.
	Church, Alonzo. (1940). A formulation of the simple type theory of types. Journal of
	Symbolic Logic, 5, 56–68.
	Constable, Robert L., et al. . (1986). Implementing mathematics with the NuPrl proof
	development system. Englewood Cliffs, New Jersey: Prentice-Hall.
	Dantzig, G.B., & Eaves, B.C. (1973). Fourier-Motzkin elimination and its dual. Journal
	of combinatorial theory (a), 14, 288–297.
	Danvy, Olivier. (1998). Functional unparsing. Journal of functional programming, 8(6),
	621–625.
	Dowek, Gilles, Felty, Amy, Herbelin, Hugo, Huet, G´erard, Murthy, Chet, Parent, Catherine,
	Paulin-Mohring, Christine, & Werner, Benjamin. (1993). The Coq proof assistant
	user’s guide. Rapport Technique 154. INRIA, Rocquencourt, France. Version 5.8.
	Dunfield, Joshua. 2002 (Sept.). Combining two forms of type refinement. Tech. rept.
	CMU-CS-02-182. Carnegie Mellon University.
	Dunfield, Joshua, & Pfenning, Frank. (2003). Type assignment for intersections and unions
	in call-by-value languages. Pages 250–266 of: Gordon, A.D. (ed), Proceedings of the 6th
	international conference on foundations of software science and computation structures
	(fossacs’03). Warsaw, Poland: Springer-Verlag LNCS 2620.
	Dunfield, Joshua, & Pfenning, Frank. (2004). Tridirectional typechecking. Pages 281–
	292 of: X.Leroy (ed), Conference record of the 31st annual symposium on principles of
	programming languages (popl’04). Venice, Italy: ACM Press. Extended version available
	as Technical Report CMU-CS-04-117, March 2004.
	Freeman, Tim, & Pfenning, Frank. (1991). Refinement types for ML. Pages 268–277 of:
	Acm sigplan conference on programming language design and implementation.
	Girard, Jean-Yves. 1972 (June). Interpr´etation fonctionnelle et Elimination ´ des coupures
	dans l’arithm´etique d’ordre sup´erieur. Th`ese de doctorat d’´etat, Universit´e de Paris VII,
	Paris, France.
	Griffin, Timothy. 1990 (January). A Formulae-as-Types Notion of Control. Pages 47–58 of:
	Conference record of popl ’90: 17th acm sigplan symposium on principles of programming
	languages.
	Harper, Robert. (1994). A simplified account of polymorphic references. Information
	processing letters, 51, 201–206.
	Hayashi, Susumu, & Nakano, Hiroshi. (1988). PX: A computational logic. The MIT Press.
	Henkin, Leon. (1950). Completeness in the theory of types. Journal of symbolic logic, 15,
	81–91.
	Hinze, Ralf. (2001). Manufacturing Datatypes. Journal of Functional Programming, 11(5),
	493–524.
	Hughes, John, Pareto, Lars, & Sabry, Amr. (1996). Proving the Correctness of Reactive
	Systems Using Sized Types. Pages 410–423 of: Proceeding of 23rd annual acm sigplan
	symposium on principles of programming languages (popl ’96).
	INRIA. Objective Caml. http://caml.inria.fr.
	Jay, C.B., & Sekanina, M. (1996). Shape checking of array programs. Tech. rept. 96.09.
	University of Technology, Sydney, Australia.
	Jones, Simon Peyton, Vytiniotis, Dimitrios, Weirich, Stephanie, & Washburn, Geoffrey.
	2005 (November). Simple unification-based type inference for gadts.
	Kahrs, Stefan. (2001). Red-black trees with types. Journal of functional programming,
	11(4), 425–432.
	Kreitz, Christoph, Hayden, Mark, & Hickey, Jason. (1998). A proof environment for the
	development of group communication systems. Pages 317–332 of: Kirchner, Hlne, &
	Kirchner, Claude (eds), 15th international conference on automated deduction. LNAI
	1421. Lindau, Germany: Springer-Verlag.
	Martin-L¨of, Per. (1984). Intuitionistic type theory. Naples, Italy: Bibliopolis.
	Martin-L¨of, Per. (1985). Constructive mathematics and computer programming. Hoare,
	C. R. A. (ed), Mathematical logic and programming languages. Prentice-Hall.
	McBride, Conor. Epigram. Available at:
	http://www.dur.ac.uk/CARG/epigram.
	Meyer, Albert, & Wand, Mitchell. (1985). Continuation Semantics in Typed Lambda
	Calculi (summary). Pages 219–224 of: Parikh, Rohit (ed), Logics of programs. SpringerVerlag
	LNCS 224.
	Michaylov, S. 1992 (August). Design and implementation of practical constraint logic
	programming systems. Ph.D. thesis, Carnegie Mellon University. Available as Technical
	Report CMU-CS-92-168.
	Milner, Robin, Tofte, Mads, Harper, Robert W., & MacQueen, D. (1997). The definition
	of standard ml (revised). Cambridge, Massachusetts: MIT Press.
	Mitchell, John C., & Plotkin, Gordon D. (1988). Abstract types have existential type.
	Acm transactions on programming languages and systems, 10(3), 470–502.
	Mitchell, John C., & Scott, Philip J. (1989). Typed lambda models and cartesian closed
	categories (preliminary version). Pages 301–316 of: Gray, John W., & Scedrov, Andre
	(eds), Categories in computer science and logic. Contemporary Mathematics, vol. 92.
	Boulder, Colorado: American Mathematical Society.
	Odersky, Martin, Zenger, Christoph, & Zenger, Matthias. (2001). Colored Local Type
	Inference. Pages 41–53 of: Proceedings of the 28th annual acm sigplan-sigact symposium
	on principles of programming languages.
	Okasaki, Chris. (1998). Purely Functional Data Structures. Cambridge University Press.
	Owre, S., Rajan, S., Rushby, J.M., Shankar, N., & Srivas, M.K. (1996). PVS: Combining
	specification, proof checking, and model checking. Pages 411–414 of: Alur, Rajeev,
	& Henzinger, Thomas A. (eds), Proceedings of the 8th international conference on
	computer-aided verification (cav ’96). New Brunswick, NJ: Springer-Verlag LNCS 1102.
	Parent, Catherine. (1995). Synthesizing proofs from programs in the calculus of inductive
	constructions. Pages 351–379 of: Proceedings of the international conference on
	mathematics for programs constructions. Springer-Verlag LNCS 947.
	Peyton Jones, Simon, et al. . 1999 (Feb.). Haskell 98 – A non-strict, purely functional
	language. Available at
	http://www.haskell.org/onlinereport/.
	Pfenning, Frank. Computation and Deduction. Cambridge University Press. (to appear).
	Pfenning, Frank, & Elliott, Conal. 1988 (June). Higher-order abstract syntax. Pages 199–
	208 of: Proceedings of the ACM SIGPLAN ’88 Symposium on Language Design and
	Implementation.
	Pierce, B., & Turner, D. (1998). Local type inference. Pages 252–265 of: Proceedings of
	25th annual acm sigplan symposium on principles of programming languages (popl ’98).
	Pottier, Franois, & R´egis-Gianas, Yann. 2006 (Jan.). Stratified type inference for generalized
	algebraic data types. Pages 232–244 of: Proceedings of the 33rd ACM symposium
	on principles of programming languages (popl’06).
	Pugh, W., & Wonnacott, D. (1992). Eliminating false data dependences using the Omega
	test. Pages 140–151 of: Acm sigplan ’92 conference on programming language design
	and implementation. ACM Press.
	Pugh, W., & Wonnacott, D. 1994 (November). Experience with constraint-based array
	dependence analysis. Tech. rept. CS-TR-3371. University of Maryland.
	Sannella, D., & Tarlecki, A. 1989 (February). Toward formal development of ML programs:
	Foundations and methodology. Tech. rept. ECS-LFCS-89-71. Laboratory for
	Foundations of Computer Science, Department of Computer Science, University of Edinburgh.
	Sheard, Tim. (2004). Languages of the future. Proceedings of the onward! track of objectedoriented
	programming systems, languages, applications (oopsla). Vancouver, BC: ACM
	Press.
	Shostak, Robert E. (1977). On the SUP-INF method for proving Presburger formulas.
	Journal of the acm, 24(4), 529–543.
	Sulzmann, M., Odersky, M., & Wehr, M. (1997). Type inference with constrained types.
	Proceedings of 4th international workshop on foundations of object-oriented languages.
	Takahashi, M. (1995). Parallel Reduction. Information and computation, 118, 120–127.
	Westbrook, Edwin, Stump, Aaron, & Wehrman, Ian. 2005 (September). A LanguageBased
	Approach to Functionally Correct Imperative Programming. Pages 268–279 of:
	Proceedings of the tenth acm sigplan international conference on functional programming.
	Wright, Andrew. (1995). Simple imperative polymorphism. Journal of Lisp and Symbolic
	Computation, 8(4), 343–355.
	Xi, Hongwei. (1998). Dependent types in practical programming. Ph.D. thesis, Carnegie
	Mellon University. pp. viii+189. Available at
	http://www.cs.cmu.edu/~hwxi/DML/thesis.ps.
	Xi, Hongwei. 1999 (September). Dependently Typed Data Structures. Pages 17–33 of:
	Proceedings of workshop on algorithmic aspects of advanced programming languages.
	Xi, Hongwei. (2003). Dependently Typed Pattern Matching. Journal of universal computer
	science, 9(8), 851–872.
	Xi, Hongwei. (2004). Applied Type System (extended abstract). Pages 394–408 of: postworkshop
	proceedings of types 2003. Springer-Verlag LNCS 3085.
	Xi, Hongwei. (2005). Applied Type System. Available at:
	http://www.cs.bu.edu/~hwxi/ATS.
	Xi, Hongwei, & Pfenning, Frank. 1998 (June). Eliminating array bound checking through
	dependent types. Pages 249–257 of: Proceedings of acm sigplan conference on programming
	language design and implementation.
	Xi, Hongwei, & Pfenning, Frank. (1999). Dependent Types in Practical Programming.
	Pages 214–227 of: Proceedings of 26th acm sigplan symposium on principles of programming
	languages. San Antonio, Texas: ACM press.
	Xi, Hongwei, Chen, Chiyan, & Chen, Gang. (2003). Guarded Recursive Datatype Constructors.
	Pages 224–235 of: Proceedings of the 30th ACM SIGPLAN Symposium on
	Principles of Programming Languages. New Orleans, LA: ACM press.
	Zenger, Christoph. (1997). Indexed types. Theoretical computer science, 187, 147–165.
	Zenger, Christoph. (1998). Indizierte typen. Ph.D. thesis, Fakult¨at fur ¨ Informatik, Universit¨at
	Karlsruhe.

		xf ,→ g xf
		e ,→ g e
		0
		c(e) ,→ g c(e
		0
		) hi ,→ g hi
		e1 ,→ g e
		0
		1 e2 ,→ g e
		0
		2
		he1, e2i ,→ g he
		0
		1, e
		0
		2i
		e ,→ g e
		0
		fst(e) ,→ g fst(e
		0
		)
		e ,→ g e
		0
		snd(e) ,→ g snd(e
		0
		)
		e ,→ g e
		0 ms ,→ g ms0
		case e of ms ,→ g case e
		0 of ms0
		e ,→ g e
		0
		lamx. e ,→ g lamx. e
		0
		e1 ,→ g e
		0
		1 e2 ,→ g e
		0
		2
		e1(e2) ,→ g e
		0
		1(e
		0
		2)
		e ,→ g e
		0
		fix f. e ,→ g fix f. e
		0
		e1 ,→ g e
		0
		1 e2 ,→ g e
		0
		2
		let x = e1 in e2 end ,→ g let x = e
		0
		1 in e
		0
		2 end
		v1 ,→ g v
		0
		1
		fst(hv1, v2i) ,→ g v
		0
		1
		v2 ,→ g v
		0
		2
		snd(hv1, v2i) ,→ g v
		0
		2
		e ,→ g e
		0
		v ,→ g v
		0
		(lamx. e)(v) ,→ g e
		0
		[x 7→ v
		0
		]
		e ,→ g e
		0
		fix f. e ,→ g e
		0
		[f 7→ fix f. e
		0
		]
		e ,→ g e
		0
		v ,→ g v
		0
		let x = v in e end ,→ g e
		0
		[x 7→ v
		0
		]
		match(v, pk) ⇒ θ ek ,→ g e
		0
		k θ ,→ g θ
		0
		case v of (p1 ⇒ e1 | · · · | pn ⇒ en) ,→ g e
		0
		k[θ
		0
		]
		x 6∈ FV(E) e ,→ g e
		0 E ,→ g E
		0
		let x = e in E[x] end ,→ g E
		0
		[e
		0
		]
		v ,→ g v
		0
		hfst(v), snd(v)i ,→ g v
		0
		v ,→ g v
		0
		lamx. v(x) ,→ g v
		0
		[] ,→ g []
		E ,→ g E
		0
		c(E) ,→ g c(E
		0
		)
		E ,→ g E
		0
		e ,→ g e
		0
		hE, ei ,→ g hE
		0
		, e
		0
		i
		v ,→ g v
		0 E ,→ g E
		0
		hv, Ei ,→ g hv
		0
		, E
		0
		i
		E ,→ g E
		0
		fst(E) ,→ g fst(E
		0
		)
		E ,→ g E
		0
		snd(E) ,→ g snd(E
		0
		)
		E ,→ g E
		0 ms ,→ g ms0
		case E of ms ,→ g case E
		0 of ms0
		E ,→ g E
		0
		e ,→ g e
		0
		E(e) ,→ g E
		0
		(e
		0
		)
		v ,→ g v
		0 E ,→ g E
		0
		v(E) ,→ g v
		0
		(E
		0
		)
		E ,→ g E
		0
		e ,→ g e
		0
		let x = E in e end ,→ g let x = E
		0
		in e
		0
		end
		e1 ,→ g e
		0
		1 · · · en ,→ g e
		0
		n
		(p1 ⇒ e1 | · · · | pn ⇒ en) ,→ g (p1 ⇒ e
		0
		1 | · · · | pn ⇒ e
		0
		n)
		θ(xf ) ,→ g θ
		0
		(xf ) for each xf in dom(θ) = dom(θ
		0
		)
		θ ,→ g θ
		0
		Fig. A 1. The rules for the parallel general reduction ,→ g

- A Proof of Lemma 2.14

	The key step in the proof of Lemma 2.14 is to show that if e ,→∗
	g
	e
	0 and e ,→ev e1
	hold then there exists e
	0
	1
	such that both e1 ,→∗
	g
	e
	0
	1
	and e
	0
	,→∗
	ev e
	0
	1 hold. We are to
	employ a notion of parallel reduction (Takahashi, 1995) to complete this key step.
	Definition A.1 (Parallel general reduction)
	Given two expressions e and e
	0
	in λpat, we say that e g-reduces to e
	0
	in parallel if
	e ,→ g e
	0
	can be derived according to the rules in Figure A 1.
	Note that the symbol ,→ g is overloaded to also mean parallel reduction on evaluation
	contexts, matching clause sequences and substitutions.
	Intuitively, e ,→ g e
	0 means that e
	0
	can be obtained from reducing (many) gredexes
	in e simultaneously. Clearly, if e g-reduces to e
	0
	, that is, e ,→g e
	0 holds,
	then e g-reduces to e
	0
	in parallel, that is e ,→ g e
	0 holds.
	Proposition A.2
	Assume that e and e
	0 are two expressions in λpat such that e ,→ g e
	0 holds.
	1. If e is an observable value, then e = e
	0
	.
	2. If e is in V-form, then so is e
	0
	.
	3. If e is in M-form, then so is e
	0
	.
	4. If e is in U-form, then so is e
	0
	.
	Proof
	Straightforward.
	Note that if e is in E-form and e ,→ g e
	0 holds, then e
	0
	is not necessarily in E-form.
	For instance, assume e = hfst(lam x. x), snd(lam x. x)i(hi). Then e is in E-form.
	Note that e ,→ g e
	0 holds for e
	0 = (lam x. x)(hi), which is not in E-form (e
	0
	is actually
	in R-form).
	The essence of parallel general reduction is captured in the following proposition.
	Proposition A.3
	1. Assume E ,→ g E0 and e ,→ g e
	0
	for some evaluation contexts E, E0 and expressions
	e, e
	0
	in λpat. Then we have E[e] ,→ g E0
	[e
	0
	].
	2. Assume e ,→ g e
	0 and θ ,→ g θ
	0
	for some expressions e, e
	0 and substitutions θ, θ
	0
	in λpat. Then we have e[θ] ,→ g e
	0
	[θ
	0
	].
	Proof
	(Sketch) By structural induction.
	In the proof of Proposition A.3, it needs to be verified that for each evaluation
	context E and θ, E[θ], the evaluation context obtained from applying θ to E, is
	also an evaluation context. This follows from the fact that θ maps each lam-variable
	x (treated as a value) in its domain to a value.
	Lemma A.4
	Assume that match(v, p) ⇒ θ is derivable in λpat, where v, p, θ are a value, a
	pattern and a substitution, respectively. If v ,→ g v
	0 holds for some value v
	0
	, then
	we can derive match(v
	0
	, p) ⇒ θ
	0
	for some θ
	0
	such that θ ,→ g θ
	0 holds.
	Proof
	(Sketch) By structural induction on the derivation of match(v, p) ⇒ θ.
	The following lemma is the key step to proving Lemma 2.14. Given two expressions
	e, e
	0
	, we write e ,→0/1
	ev e
	0
	to mean that e = e
	0 or e ,→ev e
	0
	, that is, e ev-reduces to e
	0
	in either 0 or 1 step.

	- Lemma A.5

	Assume that e1 and e
	0
	1 are two expressions in λpat such that e1 ,→ g e
	0
	1 holds. If we
	have e1 ,→ev e2 for some e2, then there exists e
	0
	2
	such that both e
	0
	1
	,→0/1
	ev e
	0
	2 and
	e2 ,→ g e
	0
	2 hold.
	Proof
	(Sketch) The proof proceeds by structural induction on the derivation D of e1 ,→ g e
	0
	1
	,
	and we present a few interesting cases as follows.
	• D is of the following form:
	e10 ,→ g e
	0
	10 ms ,→ g ms0
	case e10 of ms ,→ g case e
	0
	10 of ms0
	where e1 = case e10 of ms and e
	0
	1 = case e
	0
	10 of ms0
	. We have two subcases.
	— We have e10 ,→ev e20 for some expression e20 and e1 ,→ev e2, where e2 =
	case e20 of ms. By induction hypothesis on the derivation of e10 ,→ g e
	0
	10,
	we can find an expression e
	0
	20 such that both e
	0
	10 ,→0/1
	ev e
	0
	20 and e20 ,→ g e
	0
	20
	hold. Let e
	0
	2 be case e
	0
	20 of ms0
	, and we are done.
	— We have e1 ,→ev e2 = e1k[θ], where e10 = v for some value v, and ms =
	(p1 ⇒ e11 | · · · | pn ⇒ e1n) for some patterns p1, . . . , pn and expressions
	e11, . . . , e1n, and match(v, pk) ⇒ θ is derivable. By Proposition A.2 (2),
	we know that e
	0
	10 is in V-form (as e10 is V-form). Let v
	0 be e
	0
	10. By
	Lemma A.4, we have match(v
	0
	, pk) ⇒ θ
	0
	for some substitution θ
	0
	such that
	θ ,→ g θ
	0 holds. Note that ms0
	is of the form (p1 ⇒ e
	0
	11 | · · · | pn ⇒ e
	0
	1n
	),
	where we have e11 ,→ g e
	0
	11, . . . , e1n ,→ g e
	0
	1n
	. Let e
	0
	2 be e
	0
	1k
	[θ
	0
	]. Clearly, we
	have e
	0
	1
	,→ev e
	0
	2
	. By Proposition A.3 (2), we also have e2 ,→ g e
	0
	2
	.
	• D is of the following form
	x 6∈ FV(E) e10 ,→ g e
	0
	10 E ,→ g E0
	let x = e10 in E[x] end ,→ g E0
	[e
	0
	10]
	where e1 = let x = e10 in E[x] end and e
	0
	1 = E0
	[e
	0
	10]. We have two subcases.
	— We have e10 ,→ev e20 and e1 ,→ev e2 = let x = e20 in E[x] end. By
	induction hypothesis on the derivation of e10 ,→ g e
	0
	10, we can find an expression
	e
	0
	20 such that both e
	0
	10 ,→0/1
	ev e
	0
	20 and e20 ,→ g e
	0
	20 hold. Let e
	0
	2 be
	E0
	[e
	0
	20], and we are done.
	— We have e1 ,→ev e2 = E[v], where e10 = v for some value v. By Proposition
	A.2 (2), e
	0
	10 is a value. Let v
	0 be e
	0
	10 and e
	0
	2 = E0
	[v
	0
	]. Then we
	e
	0
	1
	,→ev e
	0
	2
	. By Proposition A.3 (1), we also have e2 ,→ g e
	0
	2
	.
	All other cases can be treated similarly.
	Lemma A.6
	Assume that e ,→ g e
	0 holds for expressions e, e
	0
	in λpat. If e ,→∗
	ev v
	∗ holds for some
	v
	∗
	in EMUV, the union of EMU and the set of observable values, then e
	0
	,→∗
	ev v
	∗
	also holds.
	Proof
	The proof proceeds by induction on n, the number of steps in e ,→∗
	ev v
	∗
	.
	• n = 0. This case immediately follows from Proposition A.2.
	• n > 0. Then we have e ,→ev e1 ,→∗
	ev v
	∗
	for some expression e1. By Lemma A.5,
	we have an expression e
	0
	1
	such that both e
	0
	,→0/1
	ev e
	0
	1
	and e1 ,→ g e
	0
	1 hold. By
	induction hypothesis, e
	0
	1
	,→∗
	ev v
	∗ holds, which implies e
	0
	,→∗
	ev v
	∗
	.
	We are now ready to present the proof of Lemma 2.14.
	Proof
	(of Lemma 2.14) In order to prove e
	0 ≤dyn e, we need to show that for any context
	G, either G[e
	0
	] ,→∗
	ev Error, or G[e
	0
	] ,→∗
	ev v
	∗
	if and only if G[e] ,→∗
	ev v
	∗
	, where v
	∗
	ranges over EMUV, that is, the union of EMU and the set of observable values.
	Let G be a context, and we have three possibilities.
	• G[e] ,→∗
	ev Error holds.
	• G[e] ,→∗
	ev v
	∗
	for some v
	∗
	in EMUV. By Lemma A.6, we have G[e
	0
	] ,→∗
	ev v
	∗
	since G[e] ,→ g G[e
	0
	] holds.
	• There exists an infinite evaluation reduction sequence from G[e] :
	G[e] = e0 ,→ev e1 ,→ev e2 ,→ev . . .
	By Lemma A.5, we have the following evaluation reduction sequence:
	G[e
	0
	] = e
	0
	0
	,→0/1
	ev e
	0
	1
	,→0/1
	ev e
	0
	2
	,→0/1
	ev . . .
	where G[e
	0
	] = e
	0
	0 and ei
	,→ g e
	0
	i
	for i = 0, 1, 2, . . .. We now need to show that
	there exist infinitely many nonempty steps in the above evaluation sequence.
	This can be done by introducing a notion of residuals of g-redexes under evreduction,
	analogous to the notion of residuals of β-redex under β-reduction
	developed in the study of pure λ-calculus (Barendregt, 1984). The situation
	here is nearly identical to the one encountered in the proof of Conservation
	Theorem (Theorem 11.3.4 (Barendregt, 1984)), and we thus omit further routine
	but rather lengthy details.
	After inspecting these three possibilities, we clearly see that this lemma holds.

- B Proof of Theorem 4.11
	
	Proof
	Let D be the typing derivation of ∅; ∅; ∅ ` e1 : τ . The proof proceeds by induction
	on the height of D. Assume that the last applied rule in D is (ty-sub). Then D is
	of the following form:
	D1 :: ∅; ∅; ∅ ` e1 : τ1 ∅; ∅ ` τ1 ≤s
	tp τ
	∅; ∅; ∅ ` e1 : τ
	(ty-sub)
	By induction hypothesis on D1, ∅; ∅; ∅ ` e2 : τ1 is derivable. Hence, ∅; ∅; ∅ ` e2 : τ
	is also derivable.

	In the rest of the proof, we assume that the last applied rule in D is not (ty-sub).
	Let e1 = E[e0] and e2 = E[e
	0
	0
	] for some evaluation context E, where e0 is a redex
	and e
	0
	0
	is the reduct of e
	0
	0
	. We proceed by analyzing the structure of E.
	As an example, let us assume that E is let x = E0 in e end for some evaluation
	context E0 and expression e. Then e1 is let x = E0[e0] in e end and the typing
	derivation D is of the following form:
	D1 :: ∅; ∅; ∅ ` E0[e0] : τ1 ∅; ∅; ∅, x : τ1 ` e : τ2
	∅; ∅; ∅ ` let x = E0[e0] in e end : τ2
	(ty-let)
	where τ2 = τ . By induction hypothesis on D1, we can derive ∅; ∅; ∅ ` E0[e
	0
	0
	] : τ1.
	Hence, we can also derive ∅; ∅; ∅ ` let x = E0[e
	0
	0
	] in e end : τ2. Note that e2 is
	let x = E0[e
	0
	0
	] in e end, and we are done.
	We skip all other cases except the most interesting one where E = [], that is,
	e1 is a redex and e2 is the reduct of e1. In this case, we proceed by inspecting the
	structure of D.
	• e1 = fst(hv1, v2i) and e2 = v1. Then D is of the following form:
	D1 :: ∅; ∅; ∅ ` hv1, v2i : τ1 ∗ τ2
	∅; ∅; ∅ ` fst(hv1, v2i) : τ1
	(ty-fst)
	where τ = τ1. By Lemma 4.6, we may assume that the last rule applied in D1
	is not (ty-sub). Hence, D1 is of the following form:
	∅; ∅; ∅ ` v1 : τ1 ∅; ∅; ∅ ` v2 : τ2
	∅; ∅; ∅ ` hv1, v2i : τ1 ∗ τ2
	(ty-prod)
	and therefore ∅; ∅; ∅ ` e2 : τ1 is derivable as e2 = v1.
	• e1 = snd(hv1, v2i) and e2 = v2. This case is symmetric to the previous one.
	• e1 = (lamx. e)(v) and e2 = e[x 7→ v]. Then D is of the following form:
	D1 :: ∅; ∅; ∅ ` lam x. e : τ1 → τ2 ∅; ∅; ∅ ` v : τ1
	∅; ∅; ∅ ` (lamx. e)(v) : τ2
	(ty-app)
	where τ = τ2. By Lemma 4.6, we may assume that the last rule applied in D1
	is not (ty-sub). Hence, D1 is of the following form
	∅; ∅; ∅, x : τ1 ` e : τ2
	∅; ∅; ∅ ` lamx. e : τ1 → τ2
	(ty-lam)
	By Lemma 4.7 (3), we know that the typing judgment ∅; ∅; ∅ ` e[x 7→ v] : τ2
	is derivable.
	• e1 = case v of ms and e2 = e[θ] for some clause p ⇒ e in ms such that
	match(v, p) ⇒ θ is derivable. Let D1, D2, D3 be derivations of ∅; ∅; ∅ ` v : τ1,
	p ↓ τ1 ⇒ (φ0; P~
	0; Γ0), and φ0; P~
	0; Γ0 ` e : τ2, respectively, where τ = τ2.
	By Lemma 4.10, we have a substitution Θ satisfying ∅ ` Θ : φ0 such that
	both ∅ |= P~
	0[Θ] and ∅ ` θ : Γ0[Θ] hold. By Lemma 4.7 (1), we know that
	∅; P~
	0[Θ]; Γ0[Θ] ` e : τ2 is derivable as τ2 contains no free occurrences of the
	index variables declared in φ0. By Lemma 4.7 (2), we know that ∅; ∅; Γ0[Θ] `
	e : τ2 is derivable. By Lemma 4.7 (3), we know that ∅; ∅; ∅ ` e[θ] : τ2 is
	derivable.
	• e1 =⊃−(⊃+(v)) for some value v. Then D is of the following form:
	D1 :: ∅; ∅; ∅ `⊃+(v) : P ⊃ τ ∅ |= P
	∅; ∅; ∅ `⊃−(⊃+(v)) : τ
	(ty-⊃-elim)
	By Lemma 4.6, we may assume that the last rule applied in D1 is not
	(ty-sub). Hence, D1 is of the following form:
	D2 :: ∅; P; ∅ ` v : τ
	∅; ∅; ∅ `⊃+(v) : P ⊃ τ
	(ty-⊃-intro)
	By Lemma 4.7 (2), the typing judgment ∅; ∅; ∅ ` v : τ is derivable. Note that
	e2 = v, and we are done.
	• e1 = Π−(Π+(v)) for some value v. Then D is of the following form:
	D1 :: ∅; ∅; ∅ ` Π
	+(v) : Πa:s. τ0 ∅ ` I : s
	∅; ∅; ∅ ` Π−(Π+(v)) : τ0[a 7→ I]
	(ty-Π-elim)
	where τ = τ0[a 7→ I]. By Lemma 4.6, we may assume that the last rule applied
	in D1 is not (ty-sub). Hence, D1 is of the following form:
	D2 :: ∅, a : s; ∅; ∅ ` v : τ0
	∅; ∅; ∅ ` Π+(v) : Πa:s. τ0
	(ty-Π-intro)
	By Lemma 4.7 (1), the typing judgment ∅; ∅; ∅ ` v : τ0[a 7→ I] is derivable.
	Note that e2 = v, and we are done.
	• e1 = let ∧(x) = ∧(v) in e end for some value v and expression e. Then D is
	of the following form:
	D1 :: ∅; ∅; ∅ ` ∧(v) : P ∧ τ1 D2 :: ∅; P; ∅, x : τ1 ` e : τ2
	∅; ∅; ∅ ` let ∧(x) = v in e end : τ2
	(ty-∧-elim)
	where τ = τ2. By Lemma 4.6, we may assume that the last rule applied in D1
	is not (ty-sub). Hence, D1 is of the following form:
	D3 :: ∅; ∅; ∅ ` v : τ1 ∅ |= P
	∅; ∅; ∅ ` ∧(v) : P ∧ τ1
	(ty-∧-intro)
	By Lemma 4.7 (2), ∅; ∅; ∅, x : τ1 ` e : τ2 is derivable, and by Lemma 4.7 (3),
	∅; ∅; ∅ ` e[x 7→ v] : τ2 is also derivable. Note that e2 = e[x 7→ v], and we are
	done.
	• e1 = let Σ(x) = Σ(v) in e end for some value v and expression e. Then D is
	of the following form:
	D1 :: ∅; ∅; ∅ ` Σ(v) : Σa:s. τ1 D2 :: ∅, a : s; ∅; ∅, x : τ1 ` e : τ2
	∅; ∅; ∅ ` let Σ(x) = v in e end : τ2
	(ty-Σ-elim)
	where τ = τ2. By Lemma 4.6, we may assume that the last rule applied in D1
	is not (ty-sub). Hence, D1 is of the following form:
	D3 :: ∅; ∅; ∅ ` v :: τ1[a 7→ I] ∅ ` I : s
	∅; ∅; ∅ ` Σ(v) : Σa:s. τ1
	(ty-Σ-intro)
	By Lemma 4.7 (1), ∅; ∅; ∅, x : τ1[a 7→ I] ` e : τ2 is derivable as τ2 contains no
	free occurrence of a. Then by Lemma 4.7 (3), ∅; ∅; ∅ ` e[x 7→ v] : τ2 is also
	derivable. Note that e2 = e[x 7→ v], and we are done.
	We thus conclude the proof of Theorem 4.11.
	
- C Proof Sketch of Theorem 6.8

	We outline in this section a proof of Theorem 6.8. Though we see no fundamental
	difficulty in handling exceptions, we will not attempt to do it here as this would
	significantly complicate the presentation of the proof.
	We first state some basic properties about typing derivations in λ
	Π,Σ
	pat extended
	with references.
	Proposition C.1
	Assume that D :: φ; P~ ; Γ `µ e : σ is derivable and there is no free occurrence of α
	in either Γ or µ. Then there is derivation of D0 of φ; P~ ; Γ `µ e : σ[α 7→ τ ] such that
	height(D) = height(D0
	) holds.
	Proof
	(Sketch) By induction on the height of D.
	Proposition C.2
	Assume that D1 : φ; P~; Γ `µ1
	e : σ is derivable and µ2 extends µ1. Then there is a
	derivation D2 of φ; P~; Γ `µ2
	e : σ such that height(D1) = height(D2) holds.
	Proof
	(Sketch) The proof proceeds by induction on the height of D1. We present the only
	interesting case in this proof, where σ = ∀α~. τ for some type τ and D1 is of the
	following form:
	D10 :: φ; P~ ; Γ `µ1
	e : τ α~ # Γ α~ # µ1 e is value-equivalent
	φ; P~ ; Γ `µ1
	e : ∀α~. τ
	(ty-poly)
	Let us choose α~
	0
	such that there is no α in α~
	0
	that has any free occurrences in Γ, τ
	or µ2. Applying Proposition C.1 (repeatedly if needed), we can obtain a derivation
	D0
	10 of φ; P~; Γ `µ1
	e : τ [α~ 7→ α~
	0
	] such that height(D10) = height(D0
	10). By induction
	hypothesis, we have a derivation D0
	20 of φ; P~ ; Γ `µ2
	e : τ [α~ 7→ α~
	0
	] such that
	height(D0
	1
	) = height(D0
	2
	). Let D2 be the following derivation:
	D0
	20 :: φ; P~ ; Γ `µ2
	e : τ [α~ 7→ α~
	0
	] α~
	0 # Γ α~
	0 # µ2 e is value-equivalent
	φ; P~ ; Γ `µ2
	e : ∀α~
	0
	. τ [α~ 7→ α~
	0
	]
	(ty-poly)
	Note that σ = ∀α~
	0
	. τ [α~ 7→ α~
	0
	], and we are done.


	The following lemma states that evaluation not involving references is typepreserving.
	
	Lemma C.3
	Assume that φ; P~; ∅ `µ e1 : σ is derivable. If e1 ,→ev e2 holds, then φ; P~ ; ∅ `µ e2 : σ
	is also derivable.

	- Proof

	(Sketch) This proof can be handled in precisely the same manner as the proof of
	Theorem 4.11 in Appendix B.
	Lemma C.3 can actually be strengthened to state that evaluation not involving
	reference creation is type-preserving.
	We are now ready to prove Theorem 6.8.

	- Proof

	(of Theorem 6.8) (Sketch) We have the following four possibilities according to the
	definition of ,→ev/st.
	• e1 ,→ev e2. This case follows from Lemma C.3 immediately.
	• e1 = E[ref(v)] for some evaluation context E and value v. This case is handled
	by analyzing the structure of E. Obviously, e1 is not value-equivalent since
	e1 ,→∗
	ev v does not hold for any value. This means that E cannot be of either
	the form ⊃+(E1) or the form Π+(E1). We encourage the reader to figure out
	what would happen if these two forms of evaluation contexts were not ruled
	out. Among the rest of the cases, the only interesting one is where E is [],
	that is, e1 = ref(v). In this case, we know that σ cannot be a type scheme
	(since e1 is not value-equivalent). Hence, σ is of the form (τ )ref for some type
	τ and ∅; ∅; ∅ `µ1
	v : τ is derivable. Also, we have M2 = M1[l 7→ v] for some
	reference constant l not in the domain of M1 and e2 = l. Let µ2 be µ1[l 7→ τ ],
	and we have M2 : µ2. Clearly, ∅; ∅; ∅ `µ2
	e2 : (τ )ref is derivable.
	• e1 = E[!l] for some evaluation context E and reference constant l. This case
	can be handled like the previous one.
	• e1 = E[l := v] for some evaluation context E, reference constant l and value
	v. This case can handled like the previous one.
	In order to fully appreciate the notion of value restriction, it is probably helpful to
	see what can happen if there is no value restriction. Assume that the constructor nil
	is given the c-type ∀α. 1 ⇒ (α)list. Clearly, we have a derivation D of the following
	judgment:
	∅; ∅; ∅ `[] ref(nil) : ((α)list)ref
	where α is some type variable. With no value restriction, the following derivation
	can be constructed
	D :: ∅; ∅; ∅ `[] ref(nil) : ((α)list)ref
	∅; ∅; ∅ `[] ref(nil) : ∀α.((α)list)ref
	Certainly, we have ([], ref(nil)) ,→ev/st ([l 7→ nil], l) for any reference constant l.
	However, there is simply no store type µ such that [l 7→ nil] : µ holds and ∅; ∅; ∅ `µ
	l : ∀α. ((α)list)ref is also derivable. For instance, let us choose µ to be [l 7→ (α)list].
	Then we can derive ∅; ∅; ∅ `µ l : ((α)list)ref, but this does not lead to a derivation
	of ∅; ∅; ∅ `µ l : ∀α. ((α)list)ref as α # µ does not hold, that is, α does have a free
	occurrence in µ. Hence, without value restriction, the theorem of subject reduction
	can no longer be established.





































































	(2) Σ;P⃗ |=S s1 →tp s2 ≤tp s′1 →tp s′2 は
	    Σ;P⃗ |=S s′1 ≤tp s1 と
	    Σ;P⃗ |=S s2 ≤tp s′2 を意味し、なおかつ

	(3) Σ; P⃗ |=S P ⊃ s ≤tp P ′ ⊃ s′ は Σ; P⃗ , P ′ |=S P と Σ; P⃗ , P ′ |=S s ≤tp s′ を意味し、なおかつ
	(4) Σ;P⃗ |=S P ∧s ≤tp P′ ∧s′ は Σ;P⃗,P |=S P′ と Σ;P⃗,P |=S s ≤tp s′ を意味し、なおかつ
	(5) Σ; P⃗ |=S ∀a : σ.s ≤tp ∀a : σ.s′ は Σ, a : σ; P⃗ |=S s ≤tp s′ を意味し、なおかつ
	(6) Σ; P⃗ |=S ∃a : σ.s ≤tp ∃a : σ.s′ は Σ, a : σ; P⃗ |=S s ≤tp s′ を意味し、なおかつ
	(7) ∅;∅ |=S scc[s1,...,sn] ≤tp scc′[s′1,...,s′n′] は scc = scc′ を意味します





# ATSの論文



2.2 Dynamics

	ATS の dynamics は型付き言語で、種 type の静的な項は dynamics における型です。
	動的な定数をいくつか宣言することができ、引数 n の動的な定数 dc それぞれに次の形の dc 型を割り当てることができます。

		∀a1:σ1 ... ∀ak:σk　.　P1 ⊃ (... (Pm ⊃ ([s1,...,sn]=>tp s)) ...)

		⊃      : ガード型
		P      : 命題
		[]=>tp : 型コンストラクタ

		∀a1:σ1 ... ∀ak:σk　.　P1 ⊃
		(... (Pm ⊃ ([s1,...,sn]=>tp s)) ...)
		s~ : 静的な項の (空である可能性のある) 列

	このとき s1,...,sn,s は型であると仮定しています。

	dc が動的なコンストラクタ dcc である場合、なんらかの型コンストラクタ scc について 型 s は scc[s~] の形を取れなければなりません。

	すると dcc は scc と関連があると言えるのです。

	静的な項の (空である可能性のある) 列を表わすのに s~ を使っていることに注意してください。



	例えば、次のように dc 型を割り当てることで、2つの動的なコンストラクタ nil と cons を型コンストラクタ list と関連付けることができます。

		nil: ∀a: type.list[a,0]
		cons: ∀a: type.∀n:int.n ≥ 0 ⊃ ([a,list[a,n]] =>tp [a,n+1])

	このとき、要素の型が a で長さが n のリストを表わす型として list[a, n] を使っています。 動的な値を動的な項に写像する動的な置換を ΘD で表わします。


	ΘD : 動的な置換
	dom(ΘD) : ΘDのドメイン
	Θ1D ∪ Θ2D　: Θ1D と Θ2D の和集合 (dom(Θ1D) ∩ dom(Θ2D) = ∅ となるような Θ1D と Θ2D)
	• : 任意の構文
	∀Σ.• : Σ = a1:σ1,　...,　ak:σk において、∀a1:σ1 ...　∀ak:σk.•
	P⃗ ⊃ •　: P⃗ = P1,...,Pm において P1 ⊃ (...(Pm ⊃ •)...)
	dc 型 : 常に ∀Σ.P⃗ ⊃ ([s1, . . . , sn] ⇒tp s)

	また ΘD のドメインを dom(ΘD) で表わします。静的な置換と同じように、動的な置換を形成して適用するような構文を示すことを省きます。

	dom(Θ1D) ∩ dom(Θ2D) = ∅ となるような Θ1D と Θ2D が与えられたとき、Θ1D と Θ2D の和集合を Θ1D ∪ Θ2D で表わします。

	任意の構文を • で表わすと、Σ = a1:σ1,　...,　ak:σk において、∀a1:σ1 ...　∀ak:σk.• を ∀Σ.• と書くことができます。

	同様に、P⃗ = P1,...,Pm において P1 ⊃ (...(Pm ⊃ •)...) を P⃗ ⊃ • と書くことができます。

	例えば、dc 型は常に ∀Σ.P⃗ ⊃ ([s1, . . . , sn] ⇒tp s)の形になります。

	動的な定数の宣言を許可するために、シグニチャの定義を次のように拡張する必要があります。

		signatures S ::= ... | S,dc:∀Σ.P~ ⊃ ([s1,...,sn] =>tp s)
		元は
		signatures S ::= S0 | S,sc:[σ1,...,σn] => bでこれに追加される。


	さらに、シグニチャを作るために次のような追加のルールが必要になります。

		|- S [sig]    Σ|-S P:bool  for each P in P~
		Σ |-S si:type  for each 1 ≤ i ≤ n  Σ|-S s:type
		----------------------------------------------
		|- S,dc : ∀Σ.P~ ⊃ ([s1,...,sn] =>tp s) [sig]

	動的な項の変数として x を、動的な項として d を用いるとき、dynamics の構文を図 3 に示します。

	引数の個数が n の動的な定数 dc が与えられたとき、引数 d1,...,dn への dc の適用を dc[d1,...,dn] と書きます。

	n = 0 の場合には dc[] の代わりに dc と書くこともできます。


		dyn. terms     d ::= x | dc[d1,...,dn] | lam x.d | app(d1,d2) |
		                     ⊃+(v) | ⊃-(d) | ∧(d) | let ∧(x) = d1 in d2 |
		                     ∀+(v) | ∀-(d) | ∃(d) | let ∃(x) = d1 in d2
		values         v ::= x | dcc[v1,...,vn] | lam x.d | ⊃+(v) | ∧(d) | ∀+(v) | ∃(v)
		dyn. var. ctx. Δ ::= 0 | Δ, x:s
		dyn. subst.   ΘD ::= [] | ΘD[x |-> d]

	図 3 dynamics の構文

		|-S[sig]
		------------
		Σ|-S 0[dctx]

		Σ|-S Δ[dctx]     Σ|-S s:type
		----------------------------
		Σ|-S Δ,x:s[dctx]

	図 4 動的な可変コンテキストを表わす形成ルール

	型の導出において帰納的な意味付けに必要な Lemma 3 を証明するために、標識 ⊃+ (·), ⊃− (·), ∧(·), ∀+(·), ∀−(·), ∃(·) を導入します。
	これらの標識がないと、型の導出において帰納的証明を行なうことが、著しく困難になります。
	Lemma 3 を証明することも困難になってしまうでしょう。
	Σ ⊢S ∆[dctx] の形の判定は、Σ と S の下で ∆ が well-formed な動的な可変コンテキストであることを示しています。
	このような判定を導出するルールを図 4 に示します。
	型付けされたコンテキトを Σ; P⃗ ; ∆ で表わします。
	次のルールは ⊢S Σ;P⃗;∆の形の判定を導出しています。
	これは Σ; P⃗ ; ∆ が well-formed であることを示しています。


		Σ|-S P:bool  for each P in P~    Σ|-Δ[dctx]
		-------------------------------------------
		              |-S Σ;P~;Δ

	Σ; P⃗ ; ∆ が well-formed な型付けされたコンテキストで、かつ Σ ⊢S s : type 導出できると仮定したとき、型付け判定は
	Σ; P⃗ ; ∆ ⊢S d : s の形を取ります。

	制約関係 |=S が正則であると仮定したとき、このような判定を導くための型付けルール を図 5 に示します。

	Σ ⊢S ΘS : Σ0 と書くとき、それぞれの a ∈ dom(ΘS) = dom(Σ) について Σ ⊢S ΘS(a) : Σ(a) が導出できることを意味します。

	型付けルールに関連する明らかな条件のいくつかを省略していることに注意してください。

	例えば、ルール (ty-∀-intro) を適用するとき、P⃗, ∆ もしくは s において値 a は自由に出現 (free occurrences) できません。

	また値の形に、型付けルール (ty-gua-intro) と (ty-∀-intro) の制約を付けています。

	これは後で ATS に作用を導入するための準備です。

	*2 技術的な理由で、ルール (ty-var) を次のようなルールで置き換えます。

		|- S Σ;P~;Δ
		Δ(x)=s
		Σ;P~|=S s ≤tp s'
		---------------------------------------(ty-var')
		Σ;P~;Δ|-S x:s'

	これは (ty-var) と (ty-sub) を結合しています。
	この置換は Lemma 2 成立させるために必要です。


	図 5 dynamics の型付けルール

		Σ;P~;Δ|-S d:s
		Σ;P~|=S s ≤tp s'
		---------------------------------------(ty-sub)
		Σ;P~;Δ|-S d:s'


		|-S Σ;P~;Δ
		S(dc)=∀Σ0.P~0⊃[s1,...,sn]=>tp s
		Σ|-S ΘS:Σ0
		Σ;P~|=S P[ΘS] for each P ∈ P~0
		Σ;P~;Δ|-S di:si[ΘS] for i = 1,...,n
		Σ;P~|=S s[ΘS] ≤tp s'
		------------------------------------(ty-dc)
		Σ;P~;Δ|-S dc[d1,...,dn]:s'


		|-S Σ;P~;Δ
		Δ(x)=s
		Σ;P~|=S s ≤tp s'
		-----------------(ty-var)
		Σ;P~;Δ|-S x:s'

		Σ;P~;Δ,x:s1 |- d:s2
		---------------------------------------(ty-fun-intro)
		Σ;P~;Δ|-S lam x.d : s1 ->tp s2

		Σ;P~;Δ|S d1:s1->tp s2
		Σ;P~;Δ|-S d2:s1
		----------------------------------------(ty-fun-elim)
		Σ;P~;Δ|-S app(d1,d2):s2

		Σ;P~,P;Δ|-S d:s
		----------------------------------------(ty-gua-intro)
		Σ;P~;Δ|-S ⊃+(d):P ⊃ s

		Σ;P~;Δ|-S d:P⊃s
		Σ;P~|=S P
		----------------------------------------(ty-gua-elim)
		Σ;P~;Δ|-S ⊃-(d): s

		Σ;P~|=S P
		Σ;P~;Δ|-S d:s
		----------------------------------------(ty-ass-intro)
		Σ;P~;Δ|-S ∧(d):P ∧ s

		Σ;P~;Δ|-S d1:P∧s1
		Σ;P~,P;Δ,x:s1|-S d2:s2
		--------------------------------------------(ty-ass-elim)
		Σ;P~;Δ|-S let ∧(x)=d1 in d2:s2

		Σ,a:σ;P~;Δ|-S v:s
		----------------------------------------(ty-∀-intro)
		Σ;P~;Δ|-S ∀+(v):∀a:σ.s

		Σ;P~;Δ|-S d:∀a:σ.s
		Σ|-S s0;σ
		-------------------------------(ty-∀-elim)
		Σ;P~;Δ|-S ∀-(d):s[a|->s0]

		Σ|-S s0:σ
		Σ;P~;Δ|-S d:s[a|->s0]
		---------------------------------(ty-∃-intro)
		Σ;P~;Δ|-S ∃(d):∃a:σ.s

		Σ;P~;Δ|-S d1:∃a:σ.s1
		Σ,a:σ;P~;Δ,x:s1|-S d2:s2
		-----------------------------------------------(ty-∃-elim)
		Σ;P~;Δ|-S let ∃(x) = d1 in d2:s2

	ここで、動的な項を評価するルールの表現に進む前に、ガード型とアサート型がセキュリティを強制する役割を演じるような、興味深いシナリオをスケッチしてみましょう。

	これらの型を理解をさらに容易にしてくれるはずです。



	Example 2. Secret は命題定数で、password と action が次のような dc 型が割り当てられた 2 つの関数で宣言されている、 と仮定します。

		action: Secret ⊃ [1] =>tp 1
		password: [1] =>tp Secret ∧ 1

	password を呼び出しが返る前になんらかの secret 情報を検証しなければならない、というような方法で関数 password を 実装することができます。
	一方では、関数呼び出し action[⟨⟩] をする前に、命題 Secret を成立させなければなりません。
	このとき、⟨⟩ はユニット型 1 の値を意味します。
	もう一方、関数呼び出し password[⟨⟩] が返った後では、命題 Secret は 成立しています。
	従って、action 呼び出しは次のプログラムパターンを意味していることになります:

		let ∧(x) = password[⟨⟩]in ... action[⟨⟩] ...


	特に x のスコープ外における action 呼び出しは ill-typed です。
	なぜなら命題 Secret を成立させることができないからです。
	値渡し (call-by-value) の動的な構文を動的な項に割り当てるために、次に定義する評価コンテキストを利用します:

		eval. ctx. E ::= [] | dc[v1,...,vi-1,E,di+1,...,dn]|
		                 app(E,d) | app(v,E) | ⊃-(E) | ∀-(E) |
		                 ∧(E)|let ∧(x)=E in d | ∃(E) | let ∃(x) = E in d

	Definition 2.

		簡約基 (redex) と簡約 (reducation) を次のように定義します。

		• app(lam x.d, v) は簡約基で、その簡約は d[x |-> v] です。
		• ⊃− (⊃+ (v)) は簡約基で、その簡約は v です。
		• let ∧ (x) = ∧(v)ind は簡約基で、その簡約は d[x |-> v] です。
		• ∀−(∀+(v)) は簡約基で、その簡約は v です。
		• let∃(x) = ∃(v)ind は簡約基で、その簡約は d[x |-> v] です。
		• なんらかの値 v に等しく定義された dcf [v1 , . . . , vn ] は簡約基で、その簡約は v です。

		なんらかの簡約基 d とその簡約 d′ について d1 = E[d] かつ d2 = E[d′] のような 2 つの動的な項 d1 と d2 が与えられたとき、d1 |-> d2 は 1 ステップで d1 を d2 に簡約することを意味します。
		|-> の再帰的で推移的なクロージャを |->∗ で表わします。
		それぞれの動的な関数定数 dcf に割り当てられた型が妥当であると仮定します。
		すなわち、もし ∅; ∅; ∅ ⊢S dcf [v1 , . . . , vn ] : s が導出でき、かつ dcf[v1, . . . , vn] |-> v が成立するなら、∅; ∅; ∅ ⊢S v : s が導出できるとします。
		判定 J が与えられたとき、D が J の導出であることを示すために D :: J と書きます。
		つまり D が J を結論とする導出であることを意味しています。

	Lemma 1 (Substitution).

		次が成立します。
		(1) D::Σ,a:σ;P⃗;∆⊢S d:sとD0 ::Σ⊢S s0 :σを仮定します。
			するとΣ;P⃗[a|->s0];∆[a|->s0]⊢S d:s[a|->s0]を導出できます。
		(2) D :: Σ;P⃗,P;∆ ⊢S d : s と Σ;P⃗ |=S P を仮定します。
			すると Σ;P⃗;∆ ⊢S d : s を導出できます。
		(3) D::Σ;P⃗;∆,x:s1 ⊢S d2 :s2 とΣ;P⃗;∆⊢S d1 :s1 を仮定します。
			するとΣ;P⃗;∆⊢S d2[x|->d1]:s2 を導出できます。

	Proof.

		D に関する構造帰納法を使って (1),(2),(3) を簡単に証明できます。
		(1) と (2) を証明する際、規則ルール (reg-subst) と (reg-cut) をそれぞれ利用する必要があります。
		導出 D が与えられたとき、D の高さを h(D) で表わします。
		これは一般的な方法で定義できます。

	Lemma 2.

		D :: Σ;P⃗;∆,x : s1 ⊢S d : s2 と Σ;P⃗ |=S s′1 ≤tp s1 を仮定します。
		すると h(D′) = h(D) となるような導出 D′ :: Σ;P⃗;∆,x : s′1 ⊢S d : s2 が存在します。

	Proof.

		証明は D に対する構造帰納法を使ってすぐに得られます。D に最後に適用されたルールが (ty-var’) であるよう な場合を扱うために、規則ルール (reg-trans) を使います。
		ルール (tyrule-eq) が存在するために、次の反転は一般的なものと少し異なります。

	Lemma 3 (Inversion). D :: Σ; P⃗ ; ∆ ⊢S d : s を仮定します。

		(1) もしd=lamx.d1 かつs=s1 →tp s2 ならばh(D′)≤h(D)であるような導出D′ ::Σ;P⃗;∆⊢S d:sが存在します。
			なおかつ D′ に適用された最後のルールは (ty-sub) ではありません。
		(2) もしd=⊃+ (d1)かつs=P ⊃s1 ならばh(D′)≤h(D)であるような導出D′ ::Σ;P⃗;∆⊢S d:sが存在します。
			なおかつ D′ に適用された最後のルールは (ty-sub) ではありません。
		(3) もしd=∧(d1)かつs=P∧s1 ならばh(D′)≤h(D)であるような導出D′ ::Σ;P⃗;∆⊢S d:sが存在します。
			なおかつ D′ に適用された最後のルールは (ty-sub) ではありません。
		(4) もしd=∀+(d1)かつs=∀a:σ.s1 ならばh(D′)≤h(D)であるような導出D′ ::Σ;P⃗;∆⊢S d:sが存在します。
			なおかつ D′ に適用された最後のルールは (ty-sub) ではありません。
		(5) もしd=∃(d1)かつs=∃a:σ.s1 ならばh(D′)≤h(D)であるような導出D′ ::Σ;P⃗;∆⊢S d:sが存在します。
			なおかつ D′ に適用された最後のルールは (ty-sub) ではありません。

	Proof.

		h(D) に関する帰納法を使います。特に、(1) を成立するために Lemma 2 が必要になります。
		ATS の型の健全性は次に示す 2 つの定理に基づいています。これらの証明は一般的であるため、ここでは省略します。

	Theorem 1 (Subject Reduction).

		D :: Σ;P⃗;∆ ⊢S d : s と d |-> d′ の両方を仮定します。
		すると Σ;P⃗;∆ ⊢S d : s を導出できます。

	Theorem 2 (Progress).

		D :: ∅; ∅; ∅ ⊢S d : s を仮定します。
		すると、 d は値となるか、もしくはなんらかの動的な項 d′ に ついてd|->d′ が成立するか、
		もしくはなんらかの簡約基でない動的な項dcf(v1,...,vn)についてd=E[dcf(v1,...,vn)] が成立します。
