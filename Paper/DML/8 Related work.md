- 8 Related work
- 8 関連研究

	Our work falls in between full program verification, either in type theory or systems such as PVS (Owre et al., 1996), and traditional type systems for programming languages.
	When compared to verification, our system is less expressive but more automatic when constraint domains with practical constraint satisfaction problems are chosen.
	Our work can be viewed as providing a systematic and uniform language interface for a verifier intended to be used as a type system during the program development cycle.
	Since it extends ML conservatively, it can be used sparingly as existing ML programs will work as before (if there is no keyword conflict).

	我々の仕事は、型理論や、PVS（Owreら、1996）のようなシステム、およびプログラミング言語のための伝統的な型システムのいずれかで、完全なプログラム検証の間に落ちます。
	検証と比較すると、我々のシステムはあまり表現力が、実用的な制約充足問題を抱える制約ドメインが選択されたときに、より自動化されています。
	我々の研究は、プログラム開発サイクル中型システムとして使用されることを意図し、検証するための系統的かつ均一な言語インターフェースを提供するとみなすことができます。
	それは保守的にMLを拡張するので、（noキーワード競合がなければ）、既存のMLプログラムは以前のように動作するように慎重に使用することができます。

	Most closely related to our work is the system of indexed types developed independently by Zenger in his Ph.D. Thesis (Zenger, 1998) (an earlier version of which is described in (Zenger, 1997)).
	He worked in the context of lazy functional programming.
	His language is simple and clean and his applications (which significantly overlap with ours) are compelling.
	In general, his approach seems to require more changes to a given Haskell program to make it amenable to checking indexed types than is the case for our system and ML. This is particularly apparent in the case of existentially quantified dependent types, which are tied to data constructors.
	This has the advantage of a simpler algorithm for elaboration and type-checking than ours, but the program (and not just the type) has to be (much) more explicit.
	For instance, one may introduce the following datatype to represent the existentially quantified type Σa:int. int(a):


	最も密接に我々の仕事に関連する博士号にZengerが独自に開発したインデックス付きの型のシステム 論文(Zenger, 1998) (以前のバージョンは (Zenger, 1997) に記載されている)です。
	彼は怠惰な関数型プログラミングの文脈で研究していました。
	彼の言語は、シンプルで清潔で、（かなり我々と重複）は彼のアプリケーションは魅力的です。
	一般的には、彼のアプローチは、我々のシステムおよびMLの場合よりもインデックス付きのタイプをチェックすることに、それが受け入れられるように与えられたHaskellのプログラムに多くの変更を必要としているようです。これは、データのコンストラクタに結びついている存在量化依存型の場合に特に明らかです。
	これは我々より推敲し、型チェックのための単純なアルゴリズムの利点がありますが、プログラム（だけでなく、型）は、より（ずっと）明示的である必要があります。
	INT：たとえば、一つのは存在量化型ΣAを表現するために、次のデータ型を導入してもよい。整数は、（a）

		datatype IntType = {a: int} Int of int (a)

	where the value constructor Int is assigned the c-type Πa : int. int(a) ⇒ IntType.
	If one also wants a type for natural numbers, then another datatype needs to be introduced as follows:

	INT：値コンストラクタINTはC型πAが割り当てられている場所。 INT（A）INTTYPEは⇒。
	一つは、自然数の型を望んでいる場合、別のデータ型は、以下のように導入する必要があります。

		datatype NatType = {a: int | a >= 0} Nat of int (a)

	where Nat is assigned the c-type ∀a : int.a ≥ 0 ⊃ (int(a) ⇒ NatType).
	If types for positive integers, negative integers, etc. are wanted, then corresponding datatypes have to be introduced accordingly. Also, one may have to define functions between these datatypes.
	For example, a function from NatType to IntType is needed to turn natural numbers into integers.
	At this point, we have strong doubts about the viability of such an approach to handling existentially quantified types, especially, in cases where the involved type index terms are drawn from a (rich) type index language such as Lint.
	Also, since the language in (Zenger, 1998) is pure, the issue of supporting indexed types in the presence of effects is not studied there.
	When compared to traditional type systems for programming languages, perhaps the most closely related work is refinement types (Freeman & Pfenning, 1991), which also aims at expressing and checking more properties of programs that are already well-typed in ML, rather than admitting more programs as type-correct, which is the goal of most other research studies on extending type systems.
	However, the mechanism of refinement types is quite different and incomparable in expressive power:

	NATがC型∀aが割り当てられている場所：int.a≥0⊃（INT（A）⇒NatType）。
	など正の整数、負の整数、用タイプが求められていた場合は、対応するデータ型がそれに応じて導入しなければなりません。また、人はこれらのデータ型の間の関数を定義する必要があります。
	例えば、int型にNatTypeから機能が整数に自然数を回すために必要とされます。
	この時点で、我々は特に、ケースに関与型の指数項は（リッチ）から引き出されている存在量化の種類、そのようなLintなどのインデックス言語を入力の取り扱いにこのようなアプローチの実行可能性について強い疑問を持っています。
	(Zenger, 1998) での言語が純粋であることからも、効果の存在にインデックス型をサポートするという問題がが検討されていません。
	プログラミング言語のための伝統的な型システム、と比較すると、おそらく最も密接に関連の仕事は洗練種類も表現し、すでにMLでよく型付けされているプログラムの多くのプロパティを確認、のではなく、認めることを目指して(Freeman & Pfenning, 1991)であり、タイプ的に正しい、タイプ·システムの拡張に関する他のほとんどの調査研究の目標であるとして複数のプログラム。
	しかし、洗練タイプのメカニズムは、表現力ではかなり異なると比類のないです。

	While refinement types incorporate intersection and can thus ascribe multiple types to terms in a uniform way, dependent types can express properties such as “these two argument lists have the same length” which are not recognizable by tree automata (the basis for type refinements).
	In (Dunfield, 2002), dependent types as formulated in (Xi, 1998; Xi & Pfenning, 1999) are combined with refinement types via regular tree grammar (Freeman & Pfenning, 1991), and this combination shows that these two forms of types can coexist naturally.
	Subsequently, a pure type assignment system that includes intersection and dependent types, as well as union and existential types, is constructed in (Dunfield & Pfenning, 2003).
	This is a rather different approach when compared with the one presented in the paper as it does not employ elaboration as a central part of the development.
	In particular, typechecking is undecidable, and the issue of undecidable type-checking is addressed in (Dunfield & Pfenning, 2004), where a new reconstruction of the rules for indefinite types (existential, union, empty types) using evaluation contexts is given.
	This new reconstruction avoids elaboration and is decidable in theory.


	洗練タイプが交差点を組み込むため、統一された方法での用語に複数の種類のものとみなすことができますが、依存型は、木オートマトン（タイプの改良のための基礎）によって認識されていない」この二つの引数リストが同じ長さを持っている」としての性質を表現することができます。
	定期的な木文法経由洗練タイプ (Freeman & Pfenning, 1991) と組み合わされ、(Xi, 1998; Xi & Pfenning, 1999)、この組み合わせは、種類の、これらの二つの形態を示している（Dunfield、2002）では、依存型がで処方として自然に共存することができます。
	続いて、交差点依存型、並びに組合と存在型を含む純粋なタイプの割当てシステムは、(Dunfield & Pfenning, 2003)で構成されている。
	それは開発の中心部として精緻を使用しないように紙に提示ものと比較した場合、これはかなり異なるアプローチです。
	具体的には、型チェックは決定不能である、と決定不能型検査の問題は、評価コンテキストを使用して、不特定の型（実存、労働組合、空のタイプ）のための新しいルールの再構成が与えられている(Dunfield & Pfenning, 2004)、で対処されています。
	この新しい再構成は、推敲を回避し、理論的に決定可能です。


	However, its effectiveness in practice is yet to be substantiated. In particular, the effectiveness of handling existential types through the use contextual type annotations in this reconstruction requires further investigation.
	Parent (Parent, 1995) proposed to reverse the process of extracting programs from constructive proofs in Coq (Dowek et al., 1993), synthesizing proof skeletons from annotated programs.
	Such proof skeletons contain “holes” corresponding to logical propositions not unlike our constraint formulas.
	In order to limit the verbosity of the required annotations, she also developed heuristics to reconstruct proofs using higher-order unification.
	Our aims and methods are similar, but much less general in the kind of specifications we can express.
	On the other hand, this allows a richer source language with fewer annotations and, in practice, avoids direct interaction with a theorem prover.

	しかし、実際には、その有効性はまだ立証される。特に、この復興での使用文脈型注釈を通して存在型を扱うの有効性は、さらなる調査が必要です。
	Parent (Parent, 1995) Coq で建設的証拠からプログラムを抽出する処理を逆にすることが提案(Dowek et al., 1993)、注釈付きのプログラムから証明骨格を合成する。
	そのような証拠スケルトンではなく我々の制約式とは異なり、論理的な命題に対応した「穴」を含んでいます。
	必要なアノテーションの冗長性を制限するために、彼女はまた、高次の統一を使用して証明を再構築するヒューリスティックを開発しました。
	我々の目的や方法は似ていますが、はるかに少ない一般の我々が表現できる仕様の一種である。
	一方、これは、実際には、定理証明器との直接的な相互作用を回避し、より少ない注釈リッチなソース言語を可能にし。


	Extended ML (Sannella & Tarlecki, 1989) is proposed as a framework for the formal development of programs in a pure fragment of Standard ML.
	The module system of Extended ML can not only declare the type of a function but also the axioms it satisfies.
	This design requires theorem proving during extended typechecking.
	In contrast, we specify and check less information about functions, thus avoiding general theorem proving.
	Cayenne (Augustsson, 1998) is a Haskell-like language in which fully dependent types are available, that is, language expressions can be used as type index objects.
	The price for this is undecidable type-checking in Cayenne.

	ML(Sannella & Tarlecki, 1989)拡張規格MLの純粋なフラグメント中のプログラムの正式な開発のためのフレームワークとして提案されています。
	拡張MLのモジュールシステムは、関数の型だけでなく、それを満たす公理を宣言することはできません。
	この設計は、拡張型チェック時の定理証明を必要とします。
	これとは対照的に、我々は指定し、したがって、一般的な定理証明を避け、関数についてより少ない情報を確認してください。
	カイエンヌ (Augustsson, 1998) は、完全に依存型言語表現がタイプインデックス·オブジェクトとして使用することができ、すなわち、利用可能であるHaskellのような言語です。
	このため価格はカイエンで決定不能型チェックです。


	For instance, the printf in C, which is not directly typable in ML, can be made typable in Cayenne, and modules can be replaced with records, but the notion of datatype refinement does not exist.
	As a pure language, Cayenne also does not address issue of supporting dependent types in the presence of effects. This clearly separates our language design from that of Cayenne.
	The notion of sized types is introduced in (Hughes et al., 1996) for proving the correctness of reactive systems.
	Though there exist some similarities between sized types and datatype refinement in DML(L) for some type index language L over the domain of natural numbers, the differences are also substantial.
	We feel that the language presented in (Hughes et al., 1996) seems too restrictive for general programming as its type system can only handle (a minor variation) of primitive recursion.
	On the other hand, the use of sized types in the correctness proofs of reactive systems cannot be achieved in DML(L) at this moment.

	たとえば、MLで直接型付け可能ではないCでのprintfは、カイエンで型付けすることができ、およびモジュールは、レコードに置き換えることができますが、データ型の洗練の概念は存在しません。
	純粋な言語として、カイエンにも効果の存在下での依存タイプをサポートするという問題に対処していない。これは明らかにカイエンのそれとは我々の言語設計を分離します。
	サイズの種類の概念が導入される（ヒューズら、1996）は、反応システムの正しさを証明する。
	自然数のドメイン上のいくつかのタイプインデックスの言語LのためのDML（L）でサイズの種類とデータ型の洗練の間にいくつかの類似点が存在するものの、違いも充実しています。
	我々は、で提示言語（ヒューズらは、1996年）は、プリミティブ再帰しか扱うことができ、その型システムとして一般的なプログラミング（マイナーバリエーション）のための制限が厳しすぎるようだと感じています。
	一方、反応系の正当性証明におけるサイズの型の使用は、この時点でDML（L）で達成することができない。


	Jay and Sekanina (Jay & Sekanina, 1996) have introduced a technique for array bounds checking elimination based on the notion of shape types.
	Shape checking is a kind of partial evaluation and has very different characteristics and source language when compared to DML(L), where constraints are linear inequalities on integers.
	We feel that their design is more restrictive and seems more promising for languages based on iteration schema rather than general recursion.
	A crucial feature in DML(L) that does not exist in either of the above two systems is existential dependent types, or more precisely, existentially quantified dependent types, which is indispensable in our experiment.
	The work on local type inference by Pierce and Turner (Pierce & Turner, 1998), which includes some empirical studies, is also based on a similar bi-directional strategy for elaboration, although they are mostly concerned with the interaction between polymorphism and subtyping, while we are concerned with dependent types.
	This work is further extended by Odersky, Zenger and Zenger in their study on colored local type inference (Odersky et al., 2001).

	ジェイとSekanina（ジェイ＆Sekanina、1996）は、形状の種類の概念に基づいて排除をチェックする配列境界のための技術を導入しています。
	形状検査は、部分評価の一種であり、制約条件が整数に対する線形不等式であるDML（L）と比較した場合、非常に異なる特性およびソース言語を有する。
	我々は、彼らのデザインは、より制限され、反復スキーマではなく、一般的な再帰に基づく言語のためのより有望なようだと感じています。
	上記の二つのシステムのいずれかで存在していないDML（L）における重要な特徴は、実存依存型であるか、またはより正確には、存在的に我々の実験において不可欠である依存型を定量した。
	彼らは多型とサブタイプの間の相互作用を持つ主に懸念しているが、いくつかの実証研究が含まれピアースとターナー（ピアース·ターナー、1998）によるローカル型推論上の作業は、また、推敲のために同じような双方向の戦略に基づいており、ながら、我々は従属型と懸念している。
	この作品は、さらに色のローカル型推論上の彼らの研究ではOdersky著、ゼンガーとゼンガーによって拡張され（Odersky著ら、2001）。

	However, we emphasize that the use of constraints for index domains is quite different from the use of constraints to model subtyping constraints (see (Sulzmann et al., 1997), for example).
	Along a different but closely related line of research, a new notion of types called guarded recursive (g.r.) datatypes are introduced (Xi et al., 2003).
	Also, phantom types are studied in (Cheney & Hinze, 2003), which are largely identical to g.r.
	In ML, it is possible to implement a function similar to printf, which, instead of applying to a format string, applies to a function argument corresponding to a parsed format string.
	Please see (Danvy, 1998) for further details.
	datatypes. Recently, this notion of types are given the name generalized algebraic datatypes (GADTs).
	On the syntactic level, GADTs are of great similarity to universal dependent datatypes in λΠ,Σ pat , essentially using types as type indexes.

	しかし、我々は、インデックスドメインの制約の使用は、サブタイプの制約をモデル化するための制約の使用とは全く異なることを強調（（Sulzmannらを参照。、1997）など）。

	研究の異なるが密接に関連したラインに沿って、ガードされた再帰的な（グラム）データ型と呼ばれるタイプの新しい概念が導入されている（西ら、2003）。

	また、ファントムタイプはGRに大部分は同じです（チェイニー＆Hinze、2003）、で研究されている

	MLには、代わりに書式文字列に適用することにより、解析された書式文字列に対応する関数の引数に適用される、printfのと同様の機能を実現することが可能である。

	詳細は（Danvy、1998）を参照してください。

	データ型。最近では、タイプのこの概念は、名前の一般化代数データ型（GADTs）を与えられている。

	構文上のレベルでは、GADTsは本質的にタイプの索引などの型を使用して、λΠ、Σパットで普遍的依存のデータ型に大きな類似性である。


	However, unlike DML-style dependent types, ML extended with GADTs is no longer a conservative extension over ML as strictly more programs can be typed in the presence of GADTs.
	On the semantic level, g.r. datatypes are a great deal more complex than dependent types. At this moment, we are not aware of any model-theoretical explanation of GADTs.
	Many examples in DML(L) can also be handled in terms of GADTS.
	As an example, suppose we want to use types to represent natural numbers; we can introduce a type Z and a type constructor S of the kind type → type; for each natural number n, we use S n(Z) to represent n, where S n means n applications of S.
	There are some serious drawbacks with this approach.

	しかし、DMLスタイルの依存型とは異なり、MLはGADTsで拡張は、もはやGADTsの存在で入力することができ、厳密以上のプログラムとして、ML上保守的な拡張子はありません。

	セマンティックレベル、G。R.オンデータ型は、依存型よりも大きな取引がより複雑である。この瞬間、我々はGADTsの任意のモデル·理論的な説明を認識していません。

	DML（L）の多くの例もGADTSの観点で取り扱うことができる。例として、我々は自然数を表すために型を使用するとします。我々は、タイプZと種別型→型の型コンストラクタSを導入することができます。 S nはS.のn個のアプリケーションを意味し、各自然数nに対して、我々は、nを表現するためにS nの（Z）を使用し

	このアプローチにはいくつかの重大な欠点がある。

	For instance, it cannot rule out forming a type like S(Z∗Z), which does not represent any natural number.
	More importantly, the programmer may need to supply proofs in a program in order for the program to pass type-checking (Sheard, 2004).
	There are also various studies on type inference addressing GADTs (Pottier & R´egis-Gianas, 2006; Jones et al., 2005), which are of rather different focus and style from the elaboration in Section 5.
	Noting the close resemblance between DML-style dependent types and the guarded recursive datatypes, we immediately initiated an effort to unify these two forms of types in a single framework, leading to the design and formalization of Applied Type System (ATS) (Xi, 2004).
	Compared to λΠ,Σ pat , ATS is certainly much more general and expressive, but it is also much more complicated, especially, semantically.

	例えば、それは任意の自然数を表すものではありませんS（Z*をのZ）、のようなタイプの形成を排除することはできません。

	さらに重要なのは、プログラマは、型チェック（シェアード、2004）を渡すようにプログラムのために、プログラムで証明を供給する必要があるかもしれません。

	GADTsアドレッシング型推論上の様々な研究もあります（ポティエ＆R'egis-Gianas、2006年には、Jonesら、2005。）、第5節で推敲とはかなり異なる焦点とスタイルである。

	DMLスタイルの依存タイプと守られて再帰的なデータ型間の密接な類似点を指摘し、我々はすぐに適用型システム（ATS）（XI、2004年の設計と形式化につながる、単一のフレームワークの型の2つの形式を統一するための努力を開始した）。

	λΠ、Σパットと比較すると、ATSは確かに多くの一般的な表現力ですが、それは特に、意味的に、またはるかに複雑である。

	For instance, unlike in λΠ,Σ pat , the definition of type equality in ATS involves impredicativity.
	In DML, we impose certain restrictions on the syntactic form of constraints so that some effective means can be found for solving constraints automatically.
	Evidently, this is a rather ad hoc design in its nature. In ATS (Xi, 2005), a language with a type system rooted in ATS, we adopt a different design.
	Instead of imposing syntactical restrictions on constraints, we provide a means for the programmer to construct proofs to attest to the validity of constraints.
	In particular, we accommodate a programming paradigm in ATS that enables the programmer to combine programming with theorem proving (Chen & Xi, 2005a).

	例えば、λΠ、Σのパットとは異なり、ATS内のタイプ等価性の定義はimpredicativityを伴う。

	DMLでは、我々はいくつかの有効な手段が自動的に制約を解決するために見つけることができるように、制約の構文形式に一定の制限を課す。

	明らかに、これは、本質的にではなく、アドホック設計である。 ATS（西、2005）では、ATSに根ざし型システムを持つ言語は、我々は異なるデザインを採用。

	代わりに、制約に構文の制約を課すことにより、我々は、制約の妥当性を証明するために証明を構築するために、プログラマのための手段を提供する。

	特に、我々は（チェン·西、2005A）を証明する定理を用いたプログラミングを組み合わせることが、プログラマを可能にATSにおけるプログラミングパラダイムに対応。
	