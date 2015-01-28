- 7 Some programming examples
- 7 プログラミング例

	We have finished prototyping a language Dependent ML (DML), which essentially extends ML with a form of dependent types in which type index terms are drawn from the type index languages Lint and Lalg presented in Section 3.3.2 and Section 3.3.1, respectively.
	At this moment, DML has already become a part of ATS, a programming language with a type system rooted in the framework Applied Type System (Xi, 2004).
	The current implementation of ATS is available on-line (Xi, 2005), which includes a type-checker and a compiler (from ATS to C) and a substantial library (containing more than 25K lines of code written in ATS itself).

	本質的に依存型の形でMLを拡張した、型インデックス言語から描かれる型インデックス項 `Lint` と `Lalg` はそれぞれ 3.3.2 及び 3.3.1 で提示し、我々は Dependent ML (DML) 言語 のプロトタイピングを完了しました。
	この時点で、DMLはすでにATSの一部となっています。ここでATSはフレームワーク応用型システム(Xi, 2004)に根ざし型システムを使用したプログラミング言語です。
	ATSの現在の実装は、オンラインで入手可能で、型チェッカおよび（ATSからCへの）コンパイラと（ATS自体で書かれたコードの25Kの以上の行を含む）実質的なライブラリが含まれています(Xi, 2005)。

	----

	When handling integer constraints, we reject nonlinear ones outrightly rather than postpone them as hard constraints (Michaylov, 1992), which is planned for future work.
	This decision of rejecting nonlinear integer constraints may seem ad hoc, and it can be too restrictive, sometimes, in a situation where nonlinear constraints (e.g., ∀n : int. n ∗ n ≥ 0) need to be dealt with.
	To address this issue, an approach to combining programming with theorem proving has been proposed recently (Chen & Xi, 2005a).

	整数制約を扱うとき、我々は、非線形なものをあからさまに拒否のではなく、将来の仕事のために計画されているハードな制約(Michaylov, 1992)としてそれらを先延ばしにします。
	非線形整数制約を拒絶するのこの決定は、アドホックに見えるかもしれません。それは非線形制約状況では、時々、あまりにも限定的であってもよい (例えば、∀n : int. n ∗ n ≥ 0) に対処する必要があります。
	この問題に対処するために、定理証明を使用したプログラミングを組み合わせることへのアプローチが提案されています(Chen & Xi, 2005a)。

	----

	If the constraints are linear, we negate them and test for unsatisfiability.
	For instance, the following is a sample constraint generated when an implementation　of binary search on arrays is type-checked:

	制約条件が線形である場合、我々は充足不能性のためにそれらとテストを否定します。
	たとえば、以下の配列上の二分探索の実装は、型チェックされると生成された制約のサンプルは、次のとおりです。

		  φ; P~ |= l + (h − l)/2 + 1 ≤ sz

		where

		  φ  = h : int,  l : int,  sz : int
		  P~ = l ≥ 0,  sz ≥ 0,  0 ≤ h + 1,  h + 1 ≤ sz,  0 ≤ l,  l ≤ sz,  h ≥ l


	The employed technique for solving linear constraints is mainly based on the FourierMotzkin variable elimination approach (Dantzig & Eaves, 1973), but there are many other practical methods available for this purpose such as the SUP-INF method (Shostak, 1977) and the well-known simplex method.
	We have chosen FourierMotzkin’s method mainly for its simplicity.*2

	線形制約を解くために用いられる技術は、主に FourierMotzkin変数削除アプローチ(Dantzig & Eaves, 1973) に基づいており、SUP-INF法(Shostak, 1977)と、よく知られているシンプレックス法のような、この目的のために利用可能な他の多くの実用的な方法が存在します。
	我々は、そのシンプルさのために主にFourierMotzkinの方法を選択しました。

		*2 Recently, we have also implemented a constraint solver based the simplex method.
		Our experience indicates that Fourier-Motzkin’s method is almost always superior to the the simplex method due to the nature of the constraints encountered in practice.

		*2 最近、我々もまた、シンプレックス法ベースの制約ソルバーで実装しました。
		我々の経験は、実際にFourier-Motzkinの手法の制約の性質により、ほとんどの場合、シンプレックス法より優れていることを示しています。

	----

	We now briefly explain this method.
	We use x for integer variables, a for integers, and l for linear expressions.
	Given a set of inequalities S, we would like to show that S is unsatisfiable.

	我々は、ここで簡単にこの方法を説明します。
	我々は、整数変数にx、整数にa、線形式にlを使用します。
	不等式の集合Sを考えるとき、我々はSが満たされないことを示したいと思います。

	We fix a variable x and transform all the linear inequalities into one of the two forms: l ≤ ax and ax ≤ l, where a ≥ 0 is assumed.
	For every pair l1 ≤ a1x and a2x ≤ l2, where a1, a2 > 0, we introduce a new inequality a2l1 ≤ a1l2 into S, and then remove from S all the inequalities involving x.
	Clearly, this is a sound but incomplete procedure.
	If x were a real variable, then the procedure would also be complete.

	我々は、変数をxとして、すべての線形不等式を `l ≤ ax` と `ax ≤ l` の二つの形式の1つに変換し、ここで `a ≥ 0` であると仮定します。

	すべてのペアについて `a1,a2 > 0`のときに`l1 ≤ a1x` かつ `a2x ≤ l2` で、我々はSに新しい不等式 `a2l1 ≤ a1l2` を導入し、その後 `S` から `x`に関連するすべての不平等取り除きます。
	明らかに、これは健全ですが不完全な手順です。
	xが実数変数だった場合は、手順も完了することになります。

	----

	In order to handle modulo arithmetic, we also perform another operation to rule out non-integer solutions: we transform an inequality of form into

	モジュロ算術演算を処理するために、我々はまた、non-integer のルールの外で別の操作を実行します。我々は、不等式の形を変換します。

		a1x1 + ··· + anxn ≤ a0,

	where a0 is the largest integer such that a0 ≤ a and the greatest common divisor of a1, ..., an divides a0.

	ここで `a0` は　`a0 ≤ a` かつ `a1, ..., an` の最大公約数は `a0` で割った最大の整数ようなものである。

		a1x1 + ··· + anxn ≤ a

	The method can be extended to become both sound and complete while remaining practical (see, for example, (Pugh & Wonnacott, 1992; Pugh & Wonnacott, 1994)).

	この方法は、実用的なまま健全で完全の両方になるように拡張することができます(例えば、(Pugh & Wonnacott, 1992; Pugh & Wonnacott, 1994)を参照)。


	----

	In DML, we do allow patterns in a matching clause sequence to be overlapping, and sequential pattern matching is performed at run-time.
	This design can lead to some complications in type-checking, which will be mentioned in Section 7.2.
	Please refer to (Xi, 2003) for more details on this issue.
	We now present some programing examples taken from a prototype implementation of DML, giving the reader some concrete feel as to how dependent types can actually be used to capture programming invariants in practice.

	DMLでは、マッチング句シーケンスのパターンが重複することを可能しており、実行時には順番にパターンマッチングが実行されます。
	この設計は、7.2節で述べる型チェックでいくつかの複雑化につながります。
	この問題の詳細については、(Xi, 2003)を参照してください。
	我々は今、実際に、DMLのプロトタイプ実装から取られたいくつかのプログラミングの例を提示し、読者に依存型に関して現実にプログラミング不変条件を捕捉するために使用することができるかのいくつかの具体的な感触を与えます。
